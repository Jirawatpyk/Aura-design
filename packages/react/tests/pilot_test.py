"""Behaviour + axe tests for the orders pilot (examples/orders/dist/index.html). python3 tests/pilot_test.py"""
import os, re, sys
from playwright.sync_api import sync_playwright, expect
HERE = os.path.dirname(os.path.abspath(__file__))
URL = 'file://' + os.path.join(HERE, '../examples/orders/dist/index.html')
def _axe_path():
    for c in [os.environ.get('AXE'), os.path.join(HERE, '../node_modules/axe-core/axe.min.js'), os.path.join(HERE, '../../../node_modules/axe-core/axe.min.js')]:
        if c and os.path.exists(c): return c
    raise SystemExit('axe-core not found: npm install, or set AXE=/path/to/axe.min.js')
AXE = open(_axe_path()).read()
CHROMIUM = os.environ.get('CHROMIUM')   # optional: a specific Chromium binary
results = []
GHA = bool(os.environ.get('GITHUB_ACTIONS'))
def gha(level, title, msg):
    # On GitHub Actions, failures and flaky passes become annotations, readable on the run page without logs.
    if GHA: print(f"::{level} title={title}::{msg.replace(chr(10), ' ')[:400]}")
def attempt(fn, page):
    try: fn(page); return None
    except Exception as e: return str(e).split('\n')[0][:300]

# A theme switch starts ~90 CSS colour transitions (150–250ms). Text colours flip at once while backgrounds
# fade, so axe run mid-fade can measure a half-changed pair (seen in CI: .aura-nav__count on the active item).
# Wait until every CSS transition has finished — deterministic, unlike a fixed sleep.
SETTLED = "() => document.getAnimations().every(a => !(a instanceof CSSTransition) || a.playState === 'finished')"
def axe(pg, label):
    pg.wait_for_function(SETTLED, timeout=5000)
    pg.add_script_tag(content=AXE)
    v = pg.evaluate("""async () => (await axe.run(document, { resultTypes: ['violations'] })).violations.map(v => v.id + ' (' + v.nodes.length + '): ' + v.nodes[0].target.join(' '))""")
    assert not v, label + ' axe: ' + '; '.join(v)

def color_scheme(pg, name, dark, system, after_reload=lambda pg: None):
    """The toggle switches the page, the choice survives a reload (head script, before paint), System follows the OS."""
    root = lambda: pg.evaluate("[document.documentElement.dataset.theme, document.documentElement.classList.contains('dark')]")
    canvas = lambda: pg.evaluate("getComputedStyle(document.body).backgroundColor")
    light_bg = canvas()
    pg.get_by_role('button', name=re.compile('^' + name)).click()
    pg.get_by_role('menuitemcheckbox', name=dark).click()
    assert root() == ['dark', True], root()
    axe(pg, 'toggled dark')
    pg.reload(); after_reload(pg)
    assert root() == ['dark', True], ('after reload', root())
    expect(pg.get_by_role('button', name=re.compile('^' + name + '.*' + dark))).to_be_visible()
    pg.get_by_role('button', name=re.compile('^' + name)).click()
    pg.get_by_role('menuitemcheckbox', name=system).click()
    assert root() == ['system', False], root()
    pg.emulate_media(color_scheme='dark'); pg.wait_for_timeout(400)
    assert root() == ['system', True] and canvas() != light_bg, ('system should follow the OS', root(), canvas())
    axe(pg, 'system dark')

# Compact density (4.14): data-density="compact" on <html> gives 36px fields/buttons and 40px rows; nothing may clip
# that didn't already (ellipsis columns do on purpose), and axe stays clean in both themes.
CLIPPED = """() => [...document.querySelectorAll('.aura-btn, .aura-input__control, .aura-table__th-label, .aura-tabs__tab, .aura-page, .aura-seg__item, .aura-choice__label')]
  .filter(e => e.offsetParent && (e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 2))
  .map(e => e.className.split(' ')[0] + ': ' + (e.textContent || e.value || '').trim().slice(0, 30))"""
def compact(pg, label):
    before = set(pg.evaluate(CLIPPED))
    pg.evaluate("document.documentElement.setAttribute('data-density','compact')")
    h = pg.evaluate("getComputedStyle(document.querySelector('.aura-btn')).height")
    assert h == '36px', label + ' compact button height ' + h
    new = [c for c in pg.evaluate(CLIPPED) if c not in before]
    assert not new, label + ' clipped in compact: ' + '; '.join(new[:5])
    axe(pg, label + ' compact light')
    pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); axe(pg, label + ' compact dark')
    pg.evaluate("document.documentElement.removeAttribute('data-theme'); document.documentElement.removeAttribute('data-density')")
def ready(pg):
    pg.goto(URL); pg.wait_for_selector('.aura-table__scroll:not([aria-busy]) > .aura-table__row:not(.aura-table__row--skeleton)', timeout=5000)

def count_text(pg): return pg.locator('.aura-table__foot [aria-live]').inner_text()

# ---------- desktop ----------
def d_axe(pg):
    axe(pg, 'light')
    pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); axe(pg, 'dark')
    pg.evaluate("document.documentElement.removeAttribute('data-theme')")
def d_thai_strings(pg):
    t = count_text(pg); assert 'จาก 48' in t, t
    expect(pg.get_by_text('หน้า 1 / 5')).to_be_visible()
def d_combobox(pg):
    cb = pg.get_by_role('combobox', name='ผู้ดูแล')
    cb.fill('kamon'); expect(pg.get_by_role('option', name=re.compile('กมล'))).to_be_visible()
    assert pg.get_by_role('listbox').get_by_role('option').count() == 1
    cb.press('Enter'); expect(cb).to_have_value('กมล ศรีวงศ์')
    cells = pg.locator('.aura-table__row [data-rc$=":4"]').all_inner_texts()
    assert cells and all(c == 'กมล ศรีวงศ์' for c in cells), cells
    cb.press('Escape'); expect(cb).to_have_value('')  # Escape clears the value
def d_range_typed(pg):
    f = pg.get_by_label('ช่วงวันที่', exact=True)
    f.fill('01/09/2569 – 05/09/2569'); f.press('Enter')
    expect(f).to_have_value('1 ก.ย. 2569 – 5 ก.ย. 2569')
    dates = pg.locator('.aura-table__row [data-rc$=":3"]').all_inner_texts()
    assert dates and all(re.match(r'[1-5] ก\.ย\. 2569', d) for d in dates), dates
    pg.get_by_role('button', name='ล้างช่วงวันที่').click(); expect(f).to_have_value('')
def d_calendar_keys(pg):
    pg.get_by_role('button', name='เปิดปฏิทิน').first.click()
    dlg = pg.get_by_role('dialog', name='ช่วงวันที่')
    expect(dlg).to_be_visible()
    focused = pg.evaluate('document.activeElement.dataset.date'); assert focused, 'focus not in grid'
    pg.keyboard.press('ArrowRight'); nxt = pg.evaluate('document.activeElement.dataset.date'); assert nxt > focused, (focused, nxt)
    pg.keyboard.press('PageDown'); assert pg.evaluate('document.activeElement.dataset.date')[:7] > nxt[:7]
    for _ in range(12):  # Tab stays inside the popover
        pg.keyboard.press('Tab'); assert pg.evaluate("!!document.activeElement.closest('.aura-cal__popover')")
    pg.keyboard.press('Escape'); expect(dlg).to_have_count(0)
    assert pg.evaluate('document.activeElement.id') == 'f-range'
def first_id(pg): return pg.locator('.aura-table__row').first.locator('[data-rc$=":1"]').inner_text()
def d_row_menu_drawer(pg):
    rid = first_id(pg)
    pg.get_by_role('button', name='จัดการ ' + rid).click()
    pg.get_by_role('menuitem', name='ดูรายละเอียด').click()
    dr = pg.get_by_role('dialog', name=rid); expect(dr).to_be_visible()
    box = dr.bounding_box(); assert abs(box['x'] + box['width'] - 1440) < 2, box
    pg.keyboard.press('Escape'); expect(dr).to_have_count(0)
def d_cell_enter(pg):
    cell = pg.locator('.aura-table__row').first.locator('[data-rc$=":7"]')
    cell.focus(); pg.keyboard.press('Enter')
    assert pg.evaluate('document.activeElement.getAttribute("aria-label")') == 'จัดการ ' + first_id(pg)
    pg.keyboard.press('Escape'); assert pg.evaluate('document.activeElement.getAttribute("data-rc")').endswith(':7')
def d_new_order(pg):
    pg.get_by_role('button', name='สร้างคำสั่งซื้อ').click()
    dlg = pg.get_by_role('dialog', name='สร้างคำสั่งซื้อ'); expect(dlg).to_be_visible()
    assert pg.evaluate('document.activeElement.closest(".aura-field") && document.activeElement.id') , 'autofocus'
    pg.get_by_role('button', name='บันทึกคำสั่งซื้อ').click()
    expect(dlg.get_by_text('ใส่ชื่อลูกค้า')).to_be_visible(); expect(dlg.get_by_text(re.compile('เลือกผู้ดูแล'))).to_be_visible()
    expect(dlg.get_by_text('ใส่ยอดเงิน')).to_be_visible()
    amount = dlg.get_by_role('spinbutton', name=re.compile('^ยอด'))
    amount.fill('2450'); amount.press('ArrowUp'); expect(amount).to_have_value('2,550')   # typed, then +step (100), formatted
    dlg.get_by_role('textbox', name=re.compile('^ลูกค้า')).fill('คุณทดสอบ ระบบ')
    cb = dlg.get_by_role('combobox', name=re.compile('^ผู้ดูแล')); cb.fill('ธนพร'); cb.press('Enter')
    # the calendar popover opens above the dialog (z-index) and picks a date
    dlg.get_by_role('button', name='เปิดปฏิทิน').click()
    cal = pg.locator('.aura-cal__popover'); expect(cal).to_be_visible()
    b = cal.bounding_box(); top = pg.evaluate(f"document.elementFromPoint({b['x']+b['width']/2},{b['y']+b['height']/2}).closest('.aura-cal__popover') !== null")
    assert top, 'calendar is under the dialog'
    cal.locator('[data-date="2026-09-25"]').click()
    expect(dlg.get_by_role('textbox', name=re.compile('^วันที่ส่ง'))).to_have_value('25 ก.ย. 2569')
    tp = dlg.get_by_role('combobox', name=re.compile('^เวลาส่ง'))
    tp.fill('19'); tp.press('Enter')
    expect(dlg.get_by_text('เลือกเวลาระหว่าง 08:00–18:00 น.')).to_be_visible()   # out of range is refused, with a reason
    tp.fill('930'); tp.press('Enter'); expect(tp).to_have_value('09:30')
    tp.press('ArrowDown'); expect(pg.get_by_role('listbox', name=re.compile('^เวลาส่ง'))).to_be_visible()
    tp.press('ArrowDown'); tp.press('Enter'); expect(tp).to_have_value('10:00')
    pg.get_by_role('button', name='บันทึกคำสั่งซื้อ').click()
    expect(pg.get_by_text('บันทึก ORD-1088 แล้ว')).to_be_visible(); expect(dlg).to_have_count(0)
    assert 'จาก 49' in count_text(pg)
    pg.get_by_role('button', name='ปิดการแจ้งเตือน').first.click(); expect(pg.locator('.aura-toast')).to_have_count(0)
def d_past_date(pg):
    pg.get_by_role('button', name='สร้างคำสั่งซื้อ').click()
    dlg = pg.get_by_role('dialog', name='สร้างคำสั่งซื้อ')
    f = dlg.get_by_role('textbox', name=re.compile('^วันที่ส่ง')); f.fill('2026-09-01'); f.press('Tab')
    pg.get_by_role('button', name='บันทึกคำสั่งซื้อ').click()
    expect(dlg.get_by_text('เลือกวันนี้หรือหลังจากนี้')).to_be_visible()
    pg.keyboard.press('Escape')
def d_cancel_undo(pg):
    row = pg.locator('.aura-table__row').filter(has_not=pg.locator('.aura-pill', has_text='ยกเลิก')).nth(1)
    rid = row.locator('[data-rc$=":1"]').inner_text(); before = row.locator('.aura-pill').inner_text()
    pg.get_by_role('button', name='จัดการ ' + rid).click()
    pg.get_by_role('menuitem', name='ยกเลิกคำสั่งซื้อ').click()
    ad = pg.get_by_role('alertdialog'); expect(ad).to_be_visible()
    ad.get_by_role('button', name='ยกเลิกคำสั่งซื้อ').click()
    row = pg.locator('.aura-table__row', has_text=rid)
    expect(row.get_by_text('ยกเลิก', exact=True)).to_be_visible()
    pg.get_by_role('button', name='เลิกทำ').click()
    expect(row.locator('.aura-pill')).to_have_text(before)

def d_upload(pg):
    import base64
    png = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
    pg.get_by_role('button', name='สร้างคำสั่งซื้อ').click()
    dlg = pg.get_by_role('dialog', name='สร้างคำสั่งซื้อ')
    inp = dlg.get_by_label(re.compile('^ไฟล์แนบ'))
    inp.set_input_files([{'name': 'kitchen.png', 'mimeType': 'image/png', 'buffer': png},
                         {'name': 'huge.png', 'mimeType': 'image/png', 'buffer': b'0' * (6 * 1024 * 1024)},
                         {'name': 'notes.txt', 'mimeType': 'text/plain', 'buffer': b'hi'}])
    items = dlg.locator('.aura-upload__item'); expect(items).to_have_count(3)
    expect(items.nth(0).locator('img')).to_have_count(1)                 # image thumbnail
    expect(items.nth(1)).to_contain_text('ไฟล์ใหญ่เกิน 5 MB')
    expect(items.nth(2)).to_contain_text('ไม่รองรับไฟล์ชนิดนี้')
    dlg.get_by_role('button', name='ลบ notes.txt').click(); expect(items).to_have_count(2)
    assert pg.evaluate('document.activeElement.type') == 'file'           # focus goes back to the input
    pg.get_by_role('button', name='บันทึกคำสั่งซื้อ').click()
    expect(dlg.get_by_text('ลบไฟล์ที่มีปัญหาก่อนบันทึก')).to_be_visible()
def d_grid_one_tab_stop(pg):
    first = pg.locator('.aura-table__row').first.locator('[data-rc$=":1"]')
    first.focus(); pg.keyboard.press('Tab')
    assert not pg.evaluate("!!document.activeElement.closest('[role=grid]')"), 'Tab stayed inside the grid'
    pg.keyboard.press('Shift+Tab'); assert pg.evaluate("document.activeElement.getAttribute('role')") == 'gridcell'
    n = pg.evaluate("[...document.querySelectorAll('[role=grid] .aura-table__td button')].filter(b => b.tabIndex >= 0).length")
    assert n == 0, f'{n} buttons in cells still in the tab order'
def d_new_filters(pg):
    # 4.9 on the pilot: multi-select category filter, and the delivery-scope segmented control
    before = count_text(pg)
    cat = pg.get_by_role('combobox', name='ประเภท', exact=True)
    cat.click()
    lst = pg.get_by_role('listbox', name='ประเภท')
    lst.get_by_role('option', name='บริการ').click(); lst.get_by_role('option', name='ค่าติดตั้ง').click()
    cat.press('Escape')
    cells = pg.locator('.aura-table__row [data-rc$=":5"]').all_inner_texts()
    shown = pg.locator('.aura-table__row').count()
    assert count_text(pg) != before, 'category filter did not narrow the table'
    pg.get_by_role('button', name='ล้าง', exact=True).click() if pg.get_by_role('button', name='ล้าง', exact=True).count() else None
    seg = pg.get_by_role('radiogroup', name='กำหนดส่ง')
    seg.get_by_role('radio', name='ทั้งหมด').focus(); pg.keyboard.press('ArrowRight')
    expect(seg.get_by_role('radio', name='วันนี้')).to_have_attribute('aria-checked', 'true')
    dates = pg.locator('.aura-table__row [data-rc$=":3"]').all_inner_texts()
    assert dates and all(d.startswith('18 ก.ย.') for d in dates), dates

def d_stats(pg):
    stats = pg.locator('.aura-stat'); expect(stats).to_have_count(4)
    expect(stats.nth(1).locator('.aura-stat__change.is-negative')).to_contain_text('+3')   # a rise that is bad news
    expect(stats.nth(3).locator('.aura-stat__change.is-positive')).to_contain_text('+12%')

def d_themes(pg):
    import glob
    for f in sorted(glob.glob(os.environ.get('THEMES', os.path.join(HERE, 'themes', '*.css')))):
        pg.evaluate('(css) => { let s = document.getElementById("t"); if (!s) { s = document.createElement("style"); s.id = "t"; document.head.appendChild(s); } s.textContent = css; }', open(f).read())
        for th in ['light', 'dark']:
            pg.evaluate(f"document.documentElement.setAttribute('data-theme','{th}')")
            pg.wait_for_timeout(350)   # let colour transitions finish before measuring
            axe(pg, os.path.basename(f) + ' ' + th)
    pg.evaluate("document.documentElement.removeAttribute('data-theme')")
def d_color_scheme(pg): color_scheme(pg, 'โหมดสี', 'มืด', 'ตามระบบ', ready)
def d_compact(pg):
    compact(pg, 'orders')
    pg.evaluate("document.documentElement.setAttribute('data-density','compact')")
    rows = pg.evaluate("[...document.querySelectorAll('.aura-table__row')].slice(0,3).map(r => r.getBoundingClientRect().height)")
    assert all(abs(h - 40) < 0.6 for h in rows), rows

# ---------- tablet ----------
def t_table_fits(pg):
    headers = pg.locator('[role=columnheader]').all_inner_texts()
    assert not any('ผู้ดูแล' in x for x in headers) and not any('ยอด' in x for x in headers), headers
    over = pg.evaluate("(() => { const g = document.querySelector('[role=grid]'); return g.scrollWidth - g.clientWidth; })()")
    assert over <= 1, f'table scrolls sideways by {over}px'
    assert pg.evaluate('document.documentElement.scrollWidth') <= 820
def t_axe(pg): axe(pg, 'tablet')

# ---------- phone ----------
def p_no_overflow(pg): assert pg.evaluate('document.documentElement.scrollWidth') <= 390
def p_axe(pg): axe(pg, 'phone')
def p_nav_drawer(pg):
    pg.get_by_role('button', name='เปิดเมนู').click()
    nav = pg.get_by_role('dialog', name='เมนูหลัก'); expect(nav).to_be_visible()
    nav.get_by_role('button', name=re.compile('ทีม')).click() if nav.get_by_role('button', name=re.compile('ทีม')).count() else nav.get_by_role('link', name=re.compile('ทีม')).click()
    expect(nav).to_have_count(0)
# 4.20: phone cards are the grid's own rows, laid out as cards by a container query.
CARD = '.aura-table__scroll > .aura-table__row:not(.aura-table__head)'
def p_filters(pg):
    pg.get_by_role('button', name='ตัวกรอง').click()
    dr = pg.get_by_role('dialog', name='ตัวกรอง'); expect(dr).to_be_visible()
    assert dr.bounding_box()['width'] >= 389, dr.bounding_box()
    dr.get_by_label('สถานะ').select_option('เสร็จสิ้น')
    dr.get_by_role('button', name='ดูผลลัพธ์').click()
    expect(pg.get_by_role('button', name='ตัวกรอง (1)')).to_be_visible()
    pills = pg.locator(CARD + ' .aura-pill').all_inner_texts(); assert pills and set(pills) == {'เสร็จสิ้น'}, pills
    pg.get_by_role('button', name='ล้าง', exact=True).click()
def p_card_detail(pg):
    pg.locator(CARD).first.locator('[data-card="field"]').first.click()
    dr = pg.get_by_role('dialog', name=re.compile('^ORD-')); expect(dr).to_be_visible()
    assert dr.bounding_box()['width'] >= 389
    pg.keyboard.press('Escape')
def p_card_menu(pg):
    pg.locator(CARD).first.get_by_role('button', name=re.compile('^จัดการ')).click()
    expect(pg.get_by_role('menu')).to_be_visible(); pg.keyboard.press('Escape')
    expect(pg.get_by_role('dialog')).to_have_count(0)  # opening the menu did not also open the detail drawer
def p_bottom_sheet(pg):
    pg.get_by_role('button', name='สร้างคำสั่งซื้อ').click()
    dlg = pg.get_by_role('dialog', name='สร้างคำสั่งซื้อ'); b = dlg.bounding_box()
    assert abs(b['y'] + b['height'] - 844) < 2 and b['width'] >= 389, b
    save = pg.get_by_role('button', name='บันทึกคำสั่งซื้อ').bounding_box(); assert save['y'] + save['height'] <= 844, ('Save below the fold', save)
    expect(dlg.get_by_text('(ไม่บังคับ)').first).to_be_visible()
    pg.get_by_role('button', name='ยกเลิก', exact=True).click()

with sync_playwright() as p:
    br = p.chromium.launch(**({'executable_path': CHROMIUM} if CHROMIUM else {}))
    for label, vp, tests in [('desktop 1440', {'width': 1440, 'height': 1000}, [d_axe, d_thai_strings, d_combobox, d_range_typed, d_calendar_keys, d_row_menu_drawer, d_cell_enter, d_new_order, d_past_date, d_cancel_undo, d_upload, d_grid_one_tab_stop, d_stats, d_themes, d_color_scheme, d_new_filters, d_compact]),
                             ('tablet 820', {'width': 820, 'height': 1100}, [t_table_fits, t_axe]),
                             ('phone 390', {'width': 390, 'height': 844}, [p_no_overflow, p_axe, p_nav_drawer, p_filters, p_card_detail, p_card_menu, p_bottom_sheet])]:
        print(label)
        for t in tests:
            first = None
            for n in (1, 2):   # one retry: a pass on retry is reported as flaky, not hidden
                pg = br.new_page(viewport=vp, reduced_motion='reduce'); errs = []
                pg.on('pageerror', lambda e: errs.append(str(e)))
                ready(pg); err = attempt(t, pg)
                if not err and errs: err = 'pageerror: ' + errs[0][:200]
                pg.close()
                if not err: break
                if n == 1: first = err; print('  retry', t.__name__, '→', err)
            if err:
                results.append((t.__name__, False, err)); print('  FAIL', t.__name__, '→', err); gha('error', 'pilot ' + label + ' ' + t.__name__, err)
            else:
                results.append((t.__name__, True, '')); print('  ok  ' if not first else '  flaky', t.__name__, '' if not first else '→ ' + first)
                if first: gha('warning', 'flaky pilot ' + label + ' ' + t.__name__, first)
    br.close()
bad = [r for r in results if not r[1]]
print(f'{len(results) - len(bad)}/{len(results)} passed')
sys.exit(1 if bad else 0)
