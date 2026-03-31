import { useState, useEffect } from 'react'

const GLOBAL_CSS = `
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #060d1f !important; }
  html { scroll-behavior: smooth; }
  input:focus { border-color: #dc2626 !important; outline: none; }
`

const REVIEWS = [
  { name: '김*준', text: '반신반의 했는데 3주만에 수익 났어요. 시그널 진짜 적중률 높습니다.', profit: '+187%', date: '3개월 전' },
  { name: '이*영', text: '혼자 매매하다 손실만 봤는데 비트라인 시그널 받고 나서 달라졌어요.', profit: '+243%', date: '1개월 전' },
  { name: '박*수', text: '비트코인 44% 폭락 때 미리 빠져나왔습니다. 신기할 정도로 정확해요.', profit: '손실 방어', date: '2주 전' },
  { name: '최*희', text: '처음 코인선물 시작했는데 매일 아침 시그널 받으니까 진짜 편해요.', profit: '+92%', date: '2개월 전' },
]

export default function Lead() {
  const [form, setForm] = useState({ name: '', phone: '', agreePrivacy: false, agreeMarketing: false })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [spotsLeft, setSpotsLeft] = useState(7)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = GLOBAL_CSS
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setSpotsLeft(p => (p > 3 ? p - 1 : p)), 60000)
    return () => clearInterval(t)
  }, [])

  function handlePhone(e) {
    const val = e.target.value.replace(/\D/g, '').slice(0, 11)
    let fmt = val
    if (val.length >= 8) fmt = val.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
    else if (val.length >= 4) fmt = val.replace(/(\d{3})(\d+)/, '$1-$2')
    setForm(f => ({ ...f, phone: fmt }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) { setError('이름을 입력해주세요.'); return }
    if (form.phone.replace(/\D/g, '').length < 10) { setError('올바른 연락처를 입력해주세요.'); return }
    if (!form.agreePrivacy) { setError('개인정보 수집 동의가 필요합니다.'); return }
    setError('')
    const list = JSON.parse(localStorage.getItem('bitline_submissions') || '[]')
    list.push({
      id: Date.now(),
      name: form.name.trim(),
      phone: form.phone,
      agreePrivacy: form.agreePrivacy,
      agreeMarketing: form.agreeMarketing,
      createdAt: new Date().toISOString(),
      source: 'lead',
    })
    localStorage.setItem('bitline_submissions', JSON.stringify(list))
    setSubmitted(true)
  }

  if (submitted) return <SuccessPage name={form.name} />

  return (
    <div style={S.root}>

      {/* ── 긴급 배너 ── */}
      <div style={S.urgentBar}>
        <span style={S.dot} />
        &nbsp;현재 선착순 무료 상담&nbsp;<strong style={{ color: '#fde68a' }}>{spotsLeft}자리</strong>&nbsp;남음
      </div>

      {/* ── 헤더: 로고만 ── */}
      <header style={S.header}>
        <div style={S.headerInner}>
          <span style={S.logo}>비트라인</span>
        </div>
      </header>

      {/* ══════════════════════════════
          상단: 훅 + 신뢰 빌드업
          ══════════════════════════════ */}

      {/* 히어로 */}
      <section style={S.hero}>
        <div style={S.heroInner}>
          <div style={S.heroBadge}>📊 3개월 연속 적중 · 전문가 분석</div>
          <h1 style={S.h1}>
            감으로 하는 투자<br />
            <span style={S.red}>이제 그만하세요</span>
          </h1>
          <p style={S.heroSub}>
            매일 아침 받는 <strong>코인선물 전문가 시그널</strong><br />
            이 하락장에서도 적중률 최대 <strong style={{ color: '#ef4444' }}>89%</strong><br />
            비트코인 44% 폭락 때도 비트라인 회원은 이미 빠져나왔습니다.
          </p>
          {/* 히어로 유일한 CTA */}
          <a href="#form" style={S.ctaBtn}>
            전문가 1:1 무료 상담 신청하기 →
          </a>
          <p style={S.heroClaim}>가입비 0원 · 선착순 마감 · 코인선물 처음이어도 OK</p>
        </div>
      </section>

      {/* 수치 */}
      <div style={S.statsBar}>
        {[
          { val: '89%', label: '최대 적중률' },
          { val: '3개월', label: '연속 적중' },
          { val: '2,800+', label: '누적 회원' },
          { val: '무료', label: '1:1 전담 상담' },
        ].map((s, i) => (
          <div key={i} style={S.statItem}>
            <div style={S.statVal}>{s.val}</div>
            <div style={S.statLbl}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* 문제 공감 */}
      <section style={S.sec}>
        <div style={S.secInner}>
          <p style={S.secEyebrow}>혹시 이런 경험 있으신가요?</p>
          <h2 style={S.secTitle}>코인선물,<br />혼자 하면 이렇게 됩니다</h2>
          <div style={S.painGrid}>
            {[
              { icon: '📉', text: '진입했는데 바로 반대로 가는 가격' },
              { icon: '😰', text: '뉴스 보고 들어갔다가 물린 경험' },
              { icon: '🌙', text: '밤새 차트 보다 멘탈 나간 날들' },
              { icon: '❌', text: '수익 났다가 다시 손실로 마감' },
            ].map((p, i) => (
              <div key={i} style={S.painCard}>
                <span style={{ fontSize: 26 }}>{p.icon}</span>
                <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{p.text}</span>
              </div>
            ))}
          </div>
          <div style={S.solveBox}>
            <div style={{ fontSize: 13, color: '#86efac', fontWeight: 700, marginBottom: 6 }}>비트라인 회원은 다릅니다</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#f1f5f9', marginBottom: 8 }}>전문가가 타이밍을 알려줍니다</div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.8 }}>
              매일 아침 <strong style={{ color: '#fbbf24' }}>정확한 진입 타이밍</strong>과 목표가, 손절가를<br />
              카카오톡으로 받아보세요. 판단은 전문가가 합니다.
            </div>
          </div>
        </div>
      </section>

      {/* 기능 */}
      <section style={{ ...S.sec, background: '#080f20' }}>
        <div style={S.secInner}>
          <p style={S.secEyebrow}>비트라인 시그널이란?</p>
          <h2 style={S.secTitle}>매일 아침 받는<br /><span style={S.red}>코인선물 시그널</span></h2>
          <div style={S.featGrid}>
            {[
              { icon: '⏰', title: '매일 아침 8시 발송', desc: '당일 주요 코인 진입 타이밍을 하루 시작 전에 파악하세요.' },
              { icon: '🎯', title: '적중률 최대 89%', desc: '감이 아닌 데이터와 차트 분석 기반의 시그널입니다.' },
              { icon: '💬', title: '1:1 전담 전문가', desc: '카카오톡으로 언제든 질문할 수 있는 전담 전문가 배정.' },
              { icon: '🛡️', title: '하락장 대응 포함', desc: '상승 뿐 아니라 폭락 시 손실 방어 시그널도 제공.' },
              { icon: '🔰', title: '초보자도 가능', desc: '코인선물 처음이어도, 손실 중이어도 시작할 수 있습니다.' },
              { icon: '💰', title: '완전 무료 상담', desc: '가입비 없음. 숨겨진 비용 없음. 선착순 무료 진행 중.' },
            ].map((f, i) => (
              <div key={i} style={S.featCard}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9', marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 후기 */}
      <section style={S.sec}>
        <div style={S.secInner}>
          <p style={S.secEyebrow}>실제 회원 후기</p>
          <h2 style={S.secTitle}>"반신반의 했는데...<br /><span style={{ color: '#22c55e' }}>감사합니다"</span></h2>
          <div style={S.reviewList}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={S.reviewCard}>
                <div style={S.reviewTop}>
                  <div style={S.avatar}>{r.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#f1f5f9' }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{r.date}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontWeight: 900, fontSize: 14, color: r.profit.includes('+') ? '#22c55e' : '#fbbf24' }}>
                    {r.profit}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginTop: 10 }}>"{r.text}"</p>
                <div style={{ color: '#fbbf24', fontSize: 12, marginTop: 6 }}>★★★★★</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOMO */}
      <section style={{ ...S.sec, background: 'linear-gradient(135deg,#0d0505,#060d1f)', textAlign: 'center' }}>
        <div style={S.secInner}>
          <div style={{ fontSize: 15, color: '#94a3b8', marginBottom: 8 }}>이 하락장에서 전문가 시그널</div>
          <div style={{ fontSize: 'clamp(2rem,8vw,3rem)', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-1px' }}>
            적중률 최대 <span style={S.red}>89%</span>
          </div>
          <div style={{ width: 50, height: 3, background: '#dc2626', borderRadius: 2, margin: '18px auto' }} />
          <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>비트라인 회원은 이미 경험했습니다</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#fbbf24' }}>
            이젠 <span style={{ textDecoration: 'underline', textDecorationColor: '#fbbf24' }}>당신</span> 차례입니다
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          하단: 신청 폼 (전환 지점)
          ══════════════════════════════ */}
      <section id="form" style={{ ...S.sec, background: '#080f20' }}>
        <div style={{ ...S.secInner, maxWidth: 480 }}>

          {/* 폼 헤더 */}
          <p style={S.secEyebrow}>선착순 무료 상담 신청</p>
          <h2 style={{ ...S.secTitle, marginBottom: 6 }}>
            지금 신청하면<br /><span style={{ color: '#22c55e' }}>급등 시그널 무료 제공</span>
          </h2>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: 13, marginBottom: 28, lineHeight: 1.7 }}>
            코인선물 처음이어도 · 손실 중이어도 OK<br />
            1:1 전문가가 직접 연락드립니다
          </p>

          {/* 폼 카드 */}
          <div style={S.formCard}>

            {/* 잔여 자리 */}
            <div style={S.spotsRow}>
              <span style={S.dot} />
              <span style={{ fontSize: 12, color: '#94a3b8' }}>현재 잔여 상담 자리</span>
              <strong style={{ color: '#ef4444', fontSize: 13 }}>{spotsLeft}석 남음</strong>
              <div style={S.spotsTrack}>
                <div style={{ ...S.spotsFill, width: `${(spotsLeft / 10) * 100}%` }} />
              </div>
            </div>

            {/* 폼 */}
            <form onSubmit={handleSubmit} style={S.form}>
              <div style={S.field}>
                <label style={S.label}>이름</label>
                <input
                  style={S.input}
                  placeholder="홍길동"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div style={S.field}>
                <label style={S.label}>연락처</label>
                <input
                  style={S.input}
                  placeholder="010-0000-0000"
                  value={form.phone}
                  onChange={handlePhone}
                  inputMode="numeric"
                />
              </div>
              <div style={S.checks}>
                <label style={S.checkLabel}>
                  <input type="checkbox" style={S.check}
                    checked={form.agreePrivacy}
                    onChange={e => setForm(f => ({ ...f, agreePrivacy: e.target.checked }))} />
                  [필수] 개인정보 수집 및 이용에 동의합니다
                </label>
                <label style={S.checkLabel}>
                  <input type="checkbox" style={S.check}
                    checked={form.agreeMarketing}
                    onChange={e => setForm(f => ({ ...f, agreeMarketing: e.target.checked }))} />
                  [선택] 마케팅 정보 수신에 동의합니다
                </label>
              </div>
              {error && <div style={S.errBox}>{error}</div>}
              <button type="submit" style={S.submitBtn}>
                무료 상담 신청하기 →
              </button>
              <p style={S.formNote}>영업일 기준 24시간 이내 전문가가 직접 연락드립니다</p>
            </form>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer style={S.footer}>
        <div style={S.footerInner}>
          <span style={S.footerLogo}>비트라인</span>
          <p style={S.footerTxt}>
            본 서비스는 투자 참고용 정보를 제공하며, 투자 결과에 대한 책임은 투자자 본인에게 있습니다.
            암호화폐 투자는 원금 손실이 발생할 수 있습니다.
          </p>
          <p style={{ ...S.footerTxt, marginTop: 6 }}>© 2025 비트라인. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}

function SuccessPage({ name }) {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = GLOBAL_CSS
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])
  return (
    <div style={{ minHeight: '100vh', background: '#060d1f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 400, animation: 'fadeUp .6s ease both' }}>
        <div style={{ fontSize: 60, marginBottom: 20 }}>✅</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: '#f1f5f9', marginBottom: 12 }}>신청 완료!</h2>
        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.9, marginBottom: 28 }}>
          <strong style={{ color: '#fbbf24' }}>{name}</strong>님, 신청해주셔서 감사합니다.<br />
          영업일 기준 <strong style={{ color: '#22c55e' }}>24시간 이내</strong>에<br />
          전문가가 직접 연락드립니다.
        </p>
        <div style={{ background: '#0a1628', border: '1px solid #1e293b', borderRadius: 12, padding: '18px 20px', fontSize: 13, color: '#64748b', lineHeight: 2 }}>
          <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>다음 단계</div>
          1. 전문가 전화 상담<br />
          2. 1:1 카카오톡 채널 연결<br />
          3. 매일 아침 시그널 수신 시작
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
const S = {
  root: { minHeight: '100vh', background: '#060d1f', color: '#e2e8f0', fontFamily: "'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
  red: { color: '#ef4444' },

  // 긴급 배너
  urgentBar: { background: '#7f1d1d', color: '#fecaca', padding: '9px 16px', textAlign: 'center', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
  dot: { display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80', flexShrink: 0, animation: 'pulse 1.5s infinite' },

  // 헤더
  header: { position: 'sticky', top: 0, zIndex: 100, background: 'rgba(6,13,31,.97)', borderBottom: '1px solid #0f172a', backdropFilter: 'blur(12px)' },
  headerInner: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', height: 52, maxWidth: 720, margin: '0 auto' },
  logo: { fontSize: '1.2rem', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.5px' },

  // 히어로
  hero: { padding: '52px 20px 48px', background: 'linear-gradient(180deg,#060d1f,#08111f)' },
  heroInner: { maxWidth: 520, margin: '0 auto', textAlign: 'center', animation: 'fadeUp .6s ease both' },
  heroBadge: { display: 'inline-block', background: 'rgba(220,38,38,.15)', color: '#fca5a5', border: '1px solid rgba(220,38,38,.3)', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700, marginBottom: 18 },
  h1: { fontSize: 'clamp(1.9rem,7vw,2.7rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: 16, color: '#f1f5f9', letterSpacing: '-1px' },
  heroSub: { fontSize: 15, color: '#94a3b8', lineHeight: 1.9, marginBottom: 28 },
  ctaBtn: {
    display: 'block', maxWidth: 340, margin: '0 auto 14px',
    background: 'linear-gradient(135deg,#dc2626,#b91c1c)',
    color: '#fff', textDecoration: 'none', textAlign: 'center',
    padding: '16px 24px', borderRadius: 10, fontSize: 16, fontWeight: 900,
    boxShadow: '0 4px 24px rgba(220,38,38,.45)', letterSpacing: '-.3px',
  },
  heroClaim: { fontSize: 12, color: '#475569', textAlign: 'center' },

  // 통계
  statsBar: { display: 'flex', background: '#080f20', borderTop: '1px solid #0f172a', borderBottom: '1px solid #0f172a' },
  statItem: { flex: 1, padding: '18px 8px', textAlign: 'center', borderRight: '1px solid #0f172a' },
  statVal: { fontSize: 'clamp(1rem,3.5vw,1.4rem)', fontWeight: 900, color: '#f1f5f9', marginBottom: 2 },
  statLbl: { color: '#475569', fontSize: 10 },

  // 섹션 공통
  sec: { padding: '52px 20px', background: '#060d1f' },
  secInner: { maxWidth: 640, margin: '0 auto' },
  secEyebrow: { textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#86efac', background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 20, padding: '4px 14px', display: 'inline-block', marginBottom: 12, marginLeft: 'auto', marginRight: 'auto', width: 'fit-content', display: 'flex', justifyContent: 'center' },
  secTitle: { fontSize: 'clamp(1.4rem,5vw,2rem)', fontWeight: 900, textAlign: 'center', marginBottom: 28, lineHeight: 1.3, color: '#f1f5f9' },

  // 문제 공감
  painGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 20 },
  painCard: { background: '#0a1628', border: '1px solid #1e293b', borderRadius: 10, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', textAlign: 'center' },
  solveBox: { background: 'linear-gradient(135deg,#0d1f12,#0a1628)', border: '1px solid rgba(34,197,94,.25)', borderRadius: 12, padding: '22px 20px', textAlign: 'center' },

  // 기능
  featGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 },
  featCard: { background: '#060d1f', border: '1px solid #0f172a', borderRadius: 10, padding: '16px 14px' },

  // 후기
  reviewList: { display: 'flex', flexDirection: 'column', gap: 12 },
  reviewCard: { background: '#0a1628', border: '1px solid #1e293b', borderRadius: 10, padding: '14px' },
  reviewTop: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: { width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#0f2a4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#93c5fd', flexShrink: 0 },

  // 폼
  formCard: { background: '#0d1829', border: '1px solid #1e293b', borderRadius: 16, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 },
  spotsRow: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,.07)', border: '1px solid rgba(239,68,68,.18)', borderRadius: 8, padding: '10px 14px' },
  spotsTrack: { width: '100%', height: 3, background: '#1e293b', borderRadius: 2, overflow: 'hidden', marginTop: 2 },
  spotsFill: { height: '100%', background: 'linear-gradient(90deg,#22c55e,#16a34a)', borderRadius: 2, transition: 'width 1s ease' },

  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  // 레이블: 작고 보조적 (uppercase + 자간)
  label: { fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' },
  // 인풋: 크고 선명하게
  input: { background: '#060d1f', border: '1px solid #1e293b', borderRadius: 8, padding: '14px 16px', fontSize: 17, fontWeight: 500, color: '#f1f5f9', width: '100%', transition: 'border-color .15s' },
  checks: { display: 'flex', flexDirection: 'column', gap: 10 },
  checkLabel: { display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: '#64748b', cursor: 'pointer', lineHeight: 1.6 },
  check: { accentColor: '#dc2626', cursor: 'pointer', marginTop: 3, flexShrink: 0, width: 14, height: 14 },
  errBox: { background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#fca5a5', borderRadius: 8, padding: '10px 14px', fontSize: 13 },
  submitBtn: { background: 'linear-gradient(135deg,#dc2626,#b91c1c)', color: '#fff', border: 'none', borderRadius: 10, padding: '17px', fontSize: 17, fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 20px rgba(220,38,38,.4)', width: '100%', letterSpacing: '-.3px' },
  formNote: { textAlign: 'center', fontSize: 11, color: '#475569' },

  // 푸터
  footer: { background: '#04080f', borderTop: '1px solid #0f172a', padding: '28px 20px' },
  footerInner: { maxWidth: 640, margin: '0 auto', textAlign: 'center' },
  footerLogo: { fontSize: '1rem', fontWeight: 900, color: '#334155', display: 'block', marginBottom: 10 },
  footerTxt: { fontSize: 11, color: '#334155', lineHeight: 1.8 },
}
