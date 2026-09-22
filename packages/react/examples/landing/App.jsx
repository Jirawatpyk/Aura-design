/* Pilot 3: a marketing launch page in the Creative register, re-branded with createTheme.
 * Checks: Surface textures, creative buttons and cards, responsive grids, FAQ, sign-up form, a project theme. */
import * as React from 'react';
import {
  Surface, Container, Stack, Grid, Card, Button, Badge, Tag, Stat, Accordion, TextField, Checkbox, Alert,
  Icon, AuraProvider, ThemeStyle, Toaster, toast, ColorSchemeToggle,
} from '@aura/react';

const BRANDS = [{ id: 'aura', label: 'AURA', brand: null }, { id: 'sky', label: 'Sky', brand: '#0ea5e9' }, { id: 'rose', label: 'Rose', brand: '#e11d48' }, { id: 'emerald', label: 'Emerald', brand: '#059669' }];

export function App() {
  const [brand, setBrand] = React.useState('aura');
  const [email, setEmail] = React.useState('');
  const [agree, setAgree] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const [done, setDone] = React.useState(false);
  const b = BRANDS.find((x) => x.id === brand);
  function join(e) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setErr('ใส่อีเมลแบบ name@company.com'); return; }
    setErr(null); setDone(true); toast({ title: 'ลงชื่อแล้ว', description: 'เราจะส่งลิงก์ทดลองใช้ไปที่ ' + email, tone: 'success' });
  }
  return (
    <AuraProvider locale="th">
      {b.brand ? <ThemeStyle brand={b.brand} primary="brand" name={b.id} /> : null}
      <header className="lp-bar">
        <Container>
          <div className="lp-bar__in">
            <strong className="lp-logo">Wren<span className="lp-dot" aria-hidden="true" /></strong>
            <Stack direction="row" gap={2} align="center" wrap>
              <span className="lp-muted" id="brand-label">ธีม:</span>
              <div role="group" aria-labelledby="brand-label" className="lp-brands">
                {BRANDS.map((x) => <Tag key={x.id} selected={brand === x.id} onClick={() => setBrand(x.id)}>{x.label}</Tag>)}
              </div>
              <ColorSchemeToggle />
            </Stack>
          </div>
        </Container>
      </header>
      <main>
        <Surface texture="mesh-grain" as="section" className="lp-hero" aria-labelledby="hero-title">
          <Container>
            <Stack gap={6} align="flex-start">
              <Badge tone="neutral" variant="outline">ใหม่ · เวอร์ชัน 2</Badge>
              <h1 id="hero-title" className="lp-display">ระบบหลังบ้านที่ทีมเล็ก<br />ทำงานได้เท่าทีมใหญ่</h1>
              <p className="lp-lead">คำสั่งซื้อ ลูกค้า ทีม ใบเสร็จ และตัวเลขทั้งหมดอยู่ในหน้าเดียว ใช้ได้กับธุรกิจทุกขนาด</p>
              <Stack direction={{ base: 'column', sm: 'row' }} gap={3} align={{ base: 'stretch', sm: 'center' }}>
                <Button variant="creative" iconRight="arrow-right" onClick={() => document.getElementById('join-email').focus()}>ทดลองใช้ฟรี 14 วัน</Button>
                <Button variant="secondary" icon="calendar">นัดดูเดโม</Button>
              </Stack>
            </Stack>
          </Container>
        </Surface>

        <section className="lp-section" aria-labelledby="stats-title">
          <Container>
            <h2 id="stats-title" className="lp-h2">ตัวเลขจากลูกค้าจริง</h2>
            <Grid columns={{ base: 1, sm: 3 }} gap={4}>
              <Stat label="เวลาปิดยอดต่อวัน" value="-72%" change={{ value: '3 ชม. → 50 นาที', direction: 'down', tone: 'positive' }} icon="clock" />
              <Stat label="คำสั่งซื้อที่ตกหล่น" value="-18%" change={{ value: 'หลังเปิดแจ้งเตือนอัตโนมัติ', direction: 'down', tone: 'positive' }} icon="ban" />
              <Stat label="ธุรกิจที่ใช้งาน" value="1,240" unit="ราย" caption="ใน 38 จังหวัด" icon="users" />
            </Grid>
          </Container>
        </section>

        <section className="lp-section lp-alt" aria-labelledby="features-title">
          <Container>
            <h2 id="features-title" className="lp-h2">ทุกอย่างที่ต้องใช้ ไม่มีที่เกิน</h2>
            <Grid minItemWidth={240} gap={6}>
              {[
                ['file-text', 'คำสั่งซื้อในที่เดียว', 'รวมทุกช่องทาง ทั้งหน้าร้าน ออนไลน์ และแชต'],
                ['users', 'มอบหมายงานอัตโนมัติ', 'ส่งงานให้คนที่ว่าง ตามทีมและสาขา'],
                ['mail', 'ใบเสร็จและใบกำกับ', 'ออกเป็น PDF ส่งทางอีเมลหรือ LINE'],
                ['chart-column', 'ตัวเลขที่อ่านรู้เรื่อง', 'รายได้ งานค้าง และสิ่งที่ต้องทำวันนี้'],
              ].map(([icon, t, d]) => (
                <Card key={t} variant="creative" headingLevel={3} title={<span className="lp-card-title"><Icon name={icon} size="md" />{t}</span>}>{d}</Card>
              ))}
            </Grid>
          </Container>
        </section>

        <section className="lp-section" aria-labelledby="faq-title">
          <Container size="narrow">
            <h2 id="faq-title" className="lp-h2">คำถามที่พบบ่อย</h2>
            <Accordion headingLevel={3} items={[
              { id: 'trial', title: 'ทดลองใช้ต้องใส่บัตรไหม', content: 'ไม่ต้อง ใช้ได้ครบทุกฟีเจอร์ 14 วัน แล้วค่อยเลือกแพ็กเกจ' },
              { id: 'data', title: 'ข้อมูลเก็บที่ไหน', content: 'เซิร์ฟเวอร์ในสิงคโปร์ เข้ารหัสทั้งตอนส่งและตอนเก็บ ส่งออกได้ทุกเมื่อ' },
              { id: 'thai', title: 'รองรับ พ.ศ. และภาษาไทยทั้งระบบไหม', content: 'รองรับ วันที่แสดงเป็น พ.ศ. ตัวเลขเงินเป็นบาท เมนูภาษาไทยทั้งหมด' },
            ]} />
          </Container>
        </section>

        <Surface texture="mesh" as="section" className="lp-section lp-cta" aria-labelledby="join-title">
          <Container size="narrow">
            <Stack gap={5}>
              <h2 id="join-title" className="lp-h2">เริ่มได้วันนี้</h2>
              {done ? <Alert tone="success" title="ลงชื่อแล้ว">ตรวจอีเมล {email} ภายใน 5 นาที</Alert> : (
                <form onSubmit={join} noValidate>
                  <Stack gap={4}>
                    <Stack direction={{ base: 'column', sm: 'row' }} gap={3} align={{ base: 'stretch', sm: 'flex-start' }}>
                      <TextField id="join-email" label="อีเมลที่ทำงาน" type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} error={err} />
                      <Button variant="creative" type="submit" className="lp-join" disabled={!agree}>รับลิงก์ทดลองใช้</Button>
                    </Stack>
                    <Checkbox id="agree" checked={agree} onChange={setAgree} description="เราไม่ส่งโฆษณา ยกเลิกได้ทุกเมื่อ">ยอมรับเงื่อนไขการใช้งาน</Checkbox>
                  </Stack>
                </form>
              )}
            </Stack>
          </Container>
        </Surface>
      </main>
      <footer className="lp-foot"><Container><span className="lp-muted">© 2026 Wren · ตัวอย่างหน้าเว็บสำหรับทดสอบ AURA</span></Container></footer>
      <Toaster />
    </AuraProvider>
  );
}
