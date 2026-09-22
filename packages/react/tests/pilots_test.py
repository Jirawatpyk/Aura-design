"""Behaviour + axe checks for pilot 2 (settings, form-heavy, react-hook-form) and pilot 3 (landing, Creative, themed).
python3 tests/pilots_test.py"""
import os, re, sys
from playwright.sync_api import sync_playwright, expect
HERE = os.path.dirname(os.path.abspath(__file__))
EX = os.path.join(HERE, '../examples')
def _axe_path():
    for c in [os.environ.get('AXE'), os.path.join(HERE, '../node_modules/axe-core/axe.min.js'), os.path.join(HERE, '../../../node_modules/axe-core/axe.min.js')]:
        if c and os.path.exists(c): return c
    raise SystemExit('axe-core not found: npm install, or set AXE=/path/to/axe.min.js')
AXE = open(_axe_path()).read()
CHROMIUM = os.environ.get('CHROMIUM')   # optional: a specific Chromium binary
results = []

def axe(pg, label):
    pg.wait_for_timeout(350)
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

GHA = bool(os.environ.get('GITHUB_ACTIONS'))
def gha(level, title, msg):
    if GHA: print(f"::{level} title={title}::{msg.replace(chr(10), ' ')[:400]}")
def run(br, name, url, vp, fn):
    first = None
    for n in (1, 2):   # one retry: a pass on retry is reported as flaky, not hidden
        pg = br.new_page(viewport=vp, reduced_motion='reduce'); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(url); pg.wait_for_timeout(500)
        try: fn(pg); err = None
        except Exception as e: err = str(e).split('\n')[0][:300]
        if not err and errs: err = 'pageerror: ' + errs[0][:200]
        pg.close()
        if not err: break
        if n == 1: first = err; print('  retry', name, '→', err)
    if err:
        results.append((name, False)); print('  FAIL', name, '→', err); gha('error', 'pilot ' + name, err)
    else:
        results.append((name, True)); print('  ok  ' if not first else '  flaky', name, '' if not first else '→ ' + first)
        if first: gha('warning', 'flaky pilot ' + name, first)

S = 'file://' + os.path.join(EX, 'settings/dist/index.html')
L = 'file://' + os.path.join(EX, 'landing/dist/index.html')
TABS = ['Profile', 'Notifications', 'Team', 'Billing', 'Audit log']

def s_axe_all_tabs(pg):
    for th in ['light', 'dark']:
        pg.evaluate(f"document.documentElement.setAttribute('data-theme','{th}')")
        for t in TABS:
            pg.get_by_role('tab', name=re.compile('^' + t)).click(); pg.wait_for_timeout(450)
            axe(pg, f'{t} {th}')
def s_rhf_validation(pg):
    save = pg.get_by_role('button', name='Save changes')
    expect(save).to_be_disabled()                                   # nothing changed yet
    name = pg.get_by_role('textbox', name=re.compile('^Full name')); name.fill('')
    email = pg.get_by_role('textbox', name=re.compile('^Email')); email.fill('not-an-email')
    save.click()
    expect(pg.get_by_text('Enter your name')).to_be_visible()
    expect(pg.get_by_text('Use an address like name@company.com')).to_be_visible()
    expect(name).to_be_focused()                                    # RHF focuses the first error via the forwarded ref
    expect(name).to_have_attribute('aria-invalid', 'true')
    name.fill('Tao Pyk'); email.fill('tao@acme.co'); save.click()
    expect(pg.get_by_text('Profile saved')).to_be_visible()
    expect(save).to_be_disabled()
def s_time_and_zone(pg):
    tz = pg.get_by_role('combobox', name='Time zone'); tz.fill('tok'); tz.press('Enter'); expect(tz).to_have_value('Asia/Tokyo')
    frm = pg.get_by_role('combobox', name='From'); frm.fill('23'); frm.press('Enter'); expect(frm).to_have_value('23:00')
    expect(pg.get_by_role('button', name='Save changes')).to_be_enabled()
def s_checkbox_labels(pg):
    pg.get_by_role('tab', name='Notifications').click()
    cb = pg.get_by_role('checkbox', name='Product news')
    expect(cb).not_to_be_checked(); pg.get_by_text('Product news', exact=True).click(); expect(cb).to_be_checked()
    expect(pg.get_by_role('checkbox', name='Mentions')).to_have_attribute('aria-describedby', 'n-mention-desc')
    pg.get_by_role('radio', name=re.compile('^Weekly')).check(); expect(pg.get_by_role('radio', name=re.compile('^Weekly'))).to_be_checked()
def s_team(pg):
    pg.get_by_role('tab', name=re.compile('^Team')).click()
    pg.get_by_role('button', name='Remove Mai K').click()
    ad = pg.get_by_role('alertdialog'); expect(ad).to_be_visible()
    ad.get_by_role('button', name='Remove Member').click()
    expect(pg.get_by_text('Mai K removed')).to_be_visible(); expect(pg.get_by_text('2 of 5 seats')).to_be_visible()
    f = pg.get_by_role('textbox', name='Add a domain'); f.fill('Acme.io'); f.press('Enter')
    expect(pg.get_by_text('acme.io', exact=True)).to_be_visible()
    pg.get_by_role('button', name='Remove example.com').click(); expect(pg.get_by_text('example.com', exact=True)).to_have_count(0)
def s_billing(pg):
    pg.get_by_role('tab', name='Billing').click()
    bar = pg.get_by_role('progressbar', name='Storage'); expect(bar).to_have_attribute('aria-valuetext', '7.4 of 10 GB')
    head = pg.get_by_role('button', name=re.compile('^Single sign-on'))
    expect(head).to_have_attribute('aria-expanded', 'false'); head.click(); expect(head).to_have_attribute('aria-expanded', 'true')
    expect(pg.get_by_role('region', name=re.compile('^Single sign-on'))).to_contain_text('Business plan')
    head.focus(); pg.keyboard.press('ArrowDown'); expect(pg.get_by_role('button', name=re.compile('^Delete workspace'))).to_be_focused()
    pg.keyboard.press('Home'); expect(pg.get_by_role('button', name=re.compile('^Export all data'))).to_be_focused()
    expect(pg.get_by_role('heading', name='No API keys yet')).to_be_visible()
def s_audit(pg):
    pg.get_by_role('tab', name='Audit log').click(); pg.wait_for_timeout(500)
    nav = pg.get_by_role('navigation', name='Audit log pages')
    first = pg.get_by_role('list', name='Audit events').locator('li').first.inner_text()
    nav.get_by_role('button', name='Page 3').click()
    expect(nav.get_by_role('button', name='Page 3')).to_have_attribute('aria-current', 'page')
    assert pg.get_by_role('list', name='Audit events').locator('li').first.inner_text() != first
    info = pg.get_by_role('button', name="What's recorded"); info.click()
    pop = pg.get_by_role('dialog', name="What's recorded"); expect(pop).to_be_visible()
    pg.keyboard.press('Escape'); expect(pop).to_have_count(0); expect(info).to_be_focused()
def s_phone(pg):
    assert pg.evaluate('document.documentElement.scrollWidth') <= 390
    pg.get_by_role('tab', name='Audit log').click(); pg.wait_for_timeout(500)
    expect(pg.get_by_role('navigation', name='Audit log pages').get_by_text('Page 1 of 6')).to_be_visible()   # compact pager
    axe(pg, 'audit phone')
    pg.get_by_role('tab', name=re.compile('^Team')).click(); pg.wait_for_timeout(300)
    f = pg.get_by_role('textbox', name='Add a domain'); b = pg.get_by_role('button', name='Add', exact=True)
    assert abs(f.bounding_box()['width'] - b.bounding_box()['width']) <= 3, 'stacked field and button should be full width on phones'
def s_color_scheme(pg): color_scheme(pg, 'Colour scheme', 'Dark', 'System', lambda pg: pg.wait_for_timeout(500))

def l_axe_brands(pg):
    for brand in ['AURA', 'Sky', 'Rose', 'Emerald']:
        pg.get_by_role('button', name=brand, exact=True).click()
        for th in ['light', 'dark']:
            pg.evaluate(f"document.documentElement.setAttribute('data-theme','{th}')")
            axe(pg, f'{brand} {th}')
def l_theme_switch(pg):
    acc = lambda: pg.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--aura-fg-accent').trim()")
    a = acc(); pg.get_by_role('button', name='Sky', exact=True).click(); b = acc()
    assert a != b, (a, b)
    expect(pg.get_by_role('button', name='Sky', exact=True)).to_have_attribute('aria-pressed', 'true')
    btn = pg.get_by_role('button', name='ทดลองใช้ฟรี 14 วัน')
    assert btn.evaluate('e => getComputedStyle(e).backgroundColor') == 'rgb(255, 255, 255)'   # Creative stays white on the mesh
def l_surface_light_in_dark(pg):
    pg.evaluate("document.documentElement.setAttribute('data-theme','dark')")
    col = pg.get_by_role('button', name='นัดดูเดโม').evaluate('e => getComputedStyle(e).color')
    assert col in ('rgb(24, 24, 27)', 'rgb(9, 9, 11)'), 'secondary button on the mesh should use light-theme ink, got ' + col
def l_signup(pg):
    submit = pg.get_by_role('button', name='รับลิงก์ทดลองใช้'); expect(submit).to_be_disabled()
    pg.get_by_text('ยอมรับเงื่อนไขการใช้งาน').click(); expect(submit).to_be_enabled()
    email = pg.get_by_role('textbox', name='อีเมลที่ทำงาน'); email.fill('abc'); submit.click()
    expect(pg.get_by_text('ใส่อีเมลแบบ name@company.com')).to_be_visible()
    email.fill('tao@wren.co'); submit.click()
    expect(pg.get_by_role('alert').or_(pg.locator('.aura-alert')).first).to_contain_text('tao@wren.co')
def l_hero_cta_focus(pg):
    pg.get_by_role('button', name='ทดลองใช้ฟรี 14 วัน').click()
    expect(pg.get_by_role('textbox', name='อีเมลที่ทำงาน')).to_be_focused()
def l_phone(pg):
    assert pg.evaluate('document.documentElement.scrollWidth') <= 390
    for th in ['light', 'dark']:
        pg.evaluate(f"document.documentElement.setAttribute('data-theme','{th}')"); axe(pg, 'phone ' + th)
    f = pg.get_by_role('textbox', name='อีเมลที่ทำงาน'); b = pg.get_by_role('button', name='รับลิงก์ทดลองใช้')
    assert abs(f.bounding_box()['width'] - b.bounding_box()['width']) <= 3
def l_color_scheme(pg): color_scheme(pg, 'โหมดสี', 'มืด', 'ตามระบบ', lambda pg: pg.wait_for_timeout(500))

with sync_playwright() as p:
    br = p.chromium.launch(**({'executable_path': CHROMIUM} if CHROMIUM else {}))
    print('settings')
    for fn in [s_axe_all_tabs, s_rhf_validation, s_time_and_zone, s_checkbox_labels, s_team, s_billing, s_audit, s_color_scheme]: run(br, fn.__name__, S, {'width': 1440, 'height': 1000}, fn)
    run(br, 's_phone', S, {'width': 390, 'height': 844}, s_phone)
    print('landing')
    for fn in [l_axe_brands, l_theme_switch, l_surface_light_in_dark, l_signup, l_hero_cta_focus, l_color_scheme]: run(br, fn.__name__, L, {'width': 1440, 'height': 900}, fn)
    run(br, 'l_phone', L, {'width': 390, 'height': 844}, l_phone)
    br.close()
bad = [r for r in results if not r[1]]
print(f'{len(results) - len(bad)}/{len(results)} passed')
sys.exit(1 if bad else 0)
