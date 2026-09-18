"""Behaviour + axe tests for the bookings pilot (examples/bookings/dist/index.html). python3 tests/pilot_test.py"""
import os, re, sys
from playwright.sync_api import sync_playwright, expect
HERE = os.path.dirname(os.path.abspath(__file__))
URL = 'file://' + os.path.join(HERE, '../examples/bookings/dist/index.html')
def _axe_path():
    for c in [os.environ.get('AXE'), os.path.join(HERE, '../node_modules/axe-core/axe.min.js'), os.path.join(HERE, '../../../node_modules/axe-core/axe.min.js')]:
        if c and os.path.exists(c): return c
    raise SystemExit('axe-core not found: npm install, or set AXE=/path/to/axe.min.js')
AXE = open(_axe_path()).read()
CHROMIUM = os.environ.get('CHROMIUM')   # optional: a specific Chromium binary
results = []
def check(name, fn, page):
    try: fn(page); results.append((name, True, '')); print('  ok  ', name)
    except Exception as e: results.append((name, False, str(e).split('\n')[0][:300])); print('  FAIL', name, '→', str(e).split('\n')[0][:300])

def axe(pg, label):
    pg.add_script_tag(content=AXE)
    v = pg.evaluate("""async () => (await axe.run(document, { resultTypes: ['violations'] })).violations.map(v => v.id + ' (' + v.nodes.length + '): ' + v.nodes[0].target.join(' '))""")
    assert not v, label + ' axe: ' + '; '.join(v)

def ready(pg):
    pg.goto(URL); pg.wait_for_selector('.aura-table:not([aria-busy]) .aura-table__row:not(.aura-table__row--skeleton), .aura-table--stacked:not([aria-busy]) .aura-table__card', timeout=5000)

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
    cb = pg.get_by_role('combobox', name='แม่บ้าน')
    cb.fill('somsri'); expect(pg.get_by_role('option', name=re.compile('สมศรี'))).to_be_visible()
    assert pg.get_by_role('listbox').get_by_role('option').count() == 1
    cb.press('Enter'); expect(cb).to_have_value('สมศรี ใจดี')
    cells = pg.locator('.aura-table__row [data-rc$=":4"]').all_inner_texts()
    assert cells and all(c == 'สมศรี ใจดี' for c in cells), cells
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
def d_row_menu_drawer(pg):
    pg.get_by_role('button', name='จัดการ BK-1040').click()
    pg.get_by_role('menuitem', name='ดูรายละเอียด').click()
    dr = pg.get_by_role('dialog', name='BK-1040'); expect(dr).to_be_visible()
    box = dr.bounding_box(); assert abs(box['x'] + box['width'] - 1440) < 2, box
    pg.keyboard.press('Escape'); expect(dr).to_have_count(0)
def d_cell_enter(pg):
    cell = pg.locator('.aura-table__row').first.locator('[data-rc$=":7"]')
    cell.focus(); pg.keyboard.press('Enter')
    assert pg.evaluate('document.activeElement.getAttribute("aria-label")') == 'จัดการ BK-1040'
    pg.keyboard.press('Escape'); assert pg.evaluate('document.activeElement.getAttribute("data-rc")').endswith(':7')
def d_new_booking(pg):
    pg.get_by_role('button', name='สร้างการจอง').click()
    dlg = pg.get_by_role('dialog', name='สร้างการจอง'); expect(dlg).to_be_visible()
    assert pg.evaluate('document.activeElement.closest(".aura-field") && document.activeElement.id') , 'autofocus'
    pg.get_by_role('button', name='บันทึกการจอง').click()
    expect(dlg.get_by_text('ใส่ชื่อลูกค้า')).to_be_visible(); expect(dlg.get_by_text(re.compile('เลือกแม่บ้าน'))).to_be_visible()
    dlg.get_by_role('textbox', name=re.compile('^ลูกค้า')).fill('คุณทดสอบ ระบบ')
    cb = dlg.get_by_role('combobox', name='แม่บ้าน'); cb.fill('มาลี'); cb.press('Enter')
    # the calendar popover opens above the dialog (z-index) and picks a date
    dlg.get_by_role('button', name='เปิดปฏิทิน').click()
    cal = pg.locator('.aura-cal__popover'); expect(cal).to_be_visible()
    b = cal.bounding_box(); top = pg.evaluate(f"document.elementFromPoint({b['x']+b['width']/2},{b['y']+b['height']/2}).closest('.aura-cal__popover') !== null")
    assert top, 'calendar is under the dialog'
    cal.locator('[data-date="2026-09-25"]').click()
    expect(dlg.get_by_role('textbox', name=re.compile('^วันที่'))).to_have_value('25 ก.ย. 2569')
    tp = dlg.get_by_role('combobox', name=re.compile('^เวลาเริ่ม'))
    tp.fill('19'); tp.press('Enter')
    expect(dlg.get_by_text('เลือกเวลาระหว่าง 08:00–18:00 น.')).to_be_visible()   # out of range is refused, with a reason
    tp.fill('930'); tp.press('Enter'); expect(tp).to_have_value('09:30')
    tp.press('ArrowDown'); expect(pg.get_by_role('listbox', name=re.compile('^เวลาเริ่ม'))).to_be_visible()
    tp.press('ArrowDown'); tp.press('Enter'); expect(tp).to_have_value('10:00')
    pg.get_by_role('button', name='บันทึกการจอง').click()
    expect(pg.get_by_text('บันทึก BK-1088 แล้ว')).to_be_visible(); expect(dlg).to_have_count(0)
    assert 'จาก 49' in count_text(pg)
    pg.get_by_role('button', name='ปิดการแจ้งเตือน').first.click(); expect(pg.locator('.aura-toast')).to_have_count(0)
def d_past_date(pg):
    pg.get_by_role('button', name='สร้างการจอง').click()
    dlg = pg.get_by_role('dialog', name='สร้างการจอง')
    f = dlg.get_by_role('textbox', name=re.compile('^วันที่')); f.fill('2026-09-01'); f.press('Tab')
    pg.get_by_role('button', name='บันทึกการจอง').click()
    expect(dlg.get_by_text('เลือกวันนี้หรือหลังจากนี้')).to_be_visible()
    pg.keyboard.press('Escape')
def d_cancel_undo(pg):
    pg.get_by_role('button', name='จัดการ BK-1061').click()
    pg.get_by_role('menuitem', name='ยกเลิกการจอง').click()
    ad = pg.get_by_role('alertdialog'); expect(ad).to_be_visible()
    ad.get_by_role('button', name='ยกเลิกการจอง').click()
    row = pg.locator('.aura-table__row', has_text='BK-1061')
    expect(row.get_by_text('ยกเลิก', exact=True)).to_be_visible()
    pg.get_by_role('button', name='เลิกทำ').click()
    expect(row.get_by_text('เสร็จแล้ว')).to_be_visible()

def d_upload(pg):
    import base64
    png = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
    pg.get_by_role('button', name='สร้างการจอง').click()
    dlg = pg.get_by_role('dialog', name='สร้างการจอง')
    inp = dlg.get_by_label(re.compile('^รูปหน้างาน'))
    inp.set_input_files([{'name': 'kitchen.png', 'mimeType': 'image/png', 'buffer': png},
                         {'name': 'huge.png', 'mimeType': 'image/png', 'buffer': b'0' * (6 * 1024 * 1024)},
                         {'name': 'notes.txt', 'mimeType': 'text/plain', 'buffer': b'hi'}])
    items = dlg.locator('.aura-upload__item'); expect(items).to_have_count(3)
    expect(items.nth(0).locator('img')).to_have_count(1)                 # image thumbnail
    expect(items.nth(1)).to_contain_text('ไฟล์ใหญ่เกิน 5 MB')
    expect(items.nth(2)).to_contain_text('ไม่รองรับไฟล์ชนิดนี้')
    dlg.get_by_role('button', name='ลบ notes.txt').click(); expect(items).to_have_count(2)
    assert pg.evaluate('document.activeElement.type') == 'file'           # focus goes back to the input
    pg.get_by_role('button', name='บันทึกการจอง').click()
    expect(dlg.get_by_text('ลบไฟล์ที่มีปัญหาก่อนบันทึก')).to_be_visible()
def d_grid_one_tab_stop(pg):
    first = pg.locator('.aura-table__row').first.locator('[data-rc$=":1"]')
    first.focus(); pg.keyboard.press('Tab')
    assert not pg.evaluate("!!document.activeElement.closest('[role=grid]')"), 'Tab stayed inside the grid'
    pg.keyboard.press('Shift+Tab'); assert pg.evaluate("document.activeElement.getAttribute('role')") == 'gridcell'
    n = pg.evaluate("[...document.querySelectorAll('[role=grid] .aura-table__td button')].filter(b => b.tabIndex >= 0).length")
    assert n == 0, f'{n} buttons in cells still in the tab order'
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

# ---------- tablet ----------
def t_table_fits(pg):
    headers = pg.locator('[role=columnheader]').all_inner_texts()
    assert not any('แม่บ้าน' in x for x in headers) and not any('ยอด' in x for x in headers), headers
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
    nav.get_by_role('button', name=re.compile('แม่บ้าน')).click() if nav.get_by_role('button', name=re.compile('แม่บ้าน')).count() else nav.get_by_role('link', name=re.compile('แม่บ้าน')).click()
    expect(nav).to_have_count(0)
def p_filters(pg):
    pg.get_by_role('button', name='ตัวกรอง').click()
    dr = pg.get_by_role('dialog', name='ตัวกรอง'); expect(dr).to_be_visible()
    assert dr.bounding_box()['width'] >= 389, dr.bounding_box()
    dr.get_by_label('สถานะ').select_option('เสร็จแล้ว')
    dr.get_by_role('button', name='ดูผลลัพธ์').click()
    expect(pg.get_by_role('button', name='ตัวกรอง (1)')).to_be_visible()
    pills = pg.locator('.aura-table__card .aura-pill').all_inner_texts(); assert pills and set(pills) == {'เสร็จแล้ว'}, pills
    pg.get_by_role('button', name='ล้าง', exact=True).click()
def p_card_detail(pg):
    pg.locator('.aura-table__card').first.locator('.aura-table__card-fields').click()
    dr = pg.get_by_role('dialog', name=re.compile('^BK-')); expect(dr).to_be_visible()
    assert dr.bounding_box()['width'] >= 389
    pg.keyboard.press('Escape')
def p_card_menu(pg):
    pg.locator('.aura-table__card').first.get_by_role('button', name=re.compile('^จัดการ')).click()
    expect(pg.get_by_role('menu')).to_be_visible(); pg.keyboard.press('Escape')
    expect(pg.get_by_role('dialog')).to_have_count(0)  # opening the menu did not also open the detail drawer
def p_bottom_sheet(pg):
    pg.get_by_role('button', name='สร้างการจอง').click()
    dlg = pg.get_by_role('dialog', name='สร้างการจอง'); b = dlg.bounding_box()
    assert abs(b['y'] + b['height'] - 844) < 2 and b['width'] >= 389, b
    save = pg.get_by_role('button', name='บันทึกการจอง').bounding_box(); assert save['y'] + save['height'] <= 844, ('Save below the fold', save)
    expect(dlg.get_by_text('(ไม่บังคับ)').first).to_be_visible()
    pg.get_by_role('button', name='ยกเลิก', exact=True).click()

with sync_playwright() as p:
    br = p.chromium.launch(**({'executable_path': CHROMIUM} if CHROMIUM else {}))
    for label, vp, tests in [('desktop 1440', {'width': 1440, 'height': 1000}, [d_axe, d_thai_strings, d_combobox, d_range_typed, d_calendar_keys, d_row_menu_drawer, d_cell_enter, d_new_booking, d_past_date, d_cancel_undo, d_upload, d_grid_one_tab_stop, d_stats, d_themes]),
                             ('tablet 820', {'width': 820, 'height': 1100}, [t_table_fits, t_axe]),
                             ('phone 390', {'width': 390, 'height': 844}, [p_no_overflow, p_axe, p_nav_drawer, p_filters, p_card_detail, p_card_menu, p_bottom_sheet])]:
        print(label)
        for t in tests:
            pg = br.new_page(viewport=vp, reduced_motion='reduce'); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            ready(pg); check(t.__name__, t, pg)
            if errs: results.append((t.__name__ + ' pageerror', False, errs[0])); print('  FAIL pageerror', errs[0])
            pg.close()
    br.close()
bad = [r for r in results if not r[1]]
print(f'{len(results) - len(bad)}/{len(results)} passed')
sys.exit(1 if bad else 0)
