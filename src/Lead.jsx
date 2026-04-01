import { useState, useEffect } from 'react'

const GLOBAL_CSS = `
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #060d1f !important; }
  html { scroll-behavior: smooth; }
  input { -webkit-appearance: none; }
  input:focus { outline: none; border-color: #dc2626 !important; }
  button:active { transform: scale(.98); }
`

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw8lBInlXfIfyGLajUkwB6DmMufRijcSpB8UgqFVO5ojowwWX0-jjz2P1rZBu_65UT5yw/exec'

// 유튜브 영상 ID — 없으면 null
const YOUTUBE_ID = null

const REVIEWS = [
  { name: '김*준', text: '반신반의했는데 3주만에 수익났어요. 시그널 적중률 진짜 높습니다.', profit: '+187%' },
  { name: '이*영', text: '혼자 매매하다 손실만 봤는데 비트라인 받고 나서 완전 달라졌어요.', profit: '+243%' },
  { name: '박*수', text: '비트코인 44% 폭락 때 미리 빠져나왔습니다. 신기할 정도로 정확해요.', profit: '손실방어' },
  { name: '최*희', text: '처음 코인선물 시작했는데 매일 아침 시그널 받으니까 진짜 편해요.', profit: '+92%' },
]

export default function Lead() {
  const [form, setForm] = useState({ name: '', phone: '', agreePrivacy: false })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [spotsLeft, setSpotsLeft] = useState(7)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = GLOBAL_CSS
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setSpotsLeft(p => p > 3 ? p - 1 : p), 90000)
    return () => clearInterval(t)
  }, [])

  function handlePhone(e) {
    const val = e.target.value.replace(/\D/g, '').slice(0, 11)
    let fmt = val
    if (val.length >= 8) fmt = val.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
    else if (val.length >= 4) fmt = val.replace(/(\d{3})(\d+)/, '$1-$2')
    setForm(f => ({ ...f, phone: fmt }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) { setError('이름을 입력해주세요.'); return }
    if (form.phone.replace(/\D/g, '').length < 10) { setError('올바른 연락처를 입력해주세요.'); return }
    if (!form.agreePrivacy) { setError('개인정보 수집에 동의해주세요.'); return }
    setError('')
    setLoading(true)

    // 로컬 저장
    const list = JSON.parse(localStorage.getItem('bitline_submissions') || '[]')
    list.push({
      id: Date.now(), name: form.name.trim(), phone: form.phone,
      agreePrivacy: true, createdAt: new Date().toISOString(), source: 'lead',
    })
    localStorage.setItem('bitline_submissions', JSON.stringify(list))

    // Apps Script 전송
    try {
      const params = new URLSearchParams({
        full_name: form.name.trim(),
        phone_number: form.phone,
        experience: '',
        amount: '',
        created_time: new Date().toISOString(),
      })
      await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, { mode: 'no-cors' })
    } catch (_) {}

    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) return <SuccessPage name={form.name} />

  return (
    <div style={S.root}>

      {/* 긴급 배너 */}
      <div style={S.urgentBar}>
        <span style={S.liveDot} />
        &nbsp;지금 <strong style={{ color: '#fde68a' }}>{spotsLeft}명</strong>만 무료 상담 가능 · 선착순 마감
      </div>

      {/* 헤더 */}
      <header style={S.header}>
        <div style={S.headerInner}>
          <span style={S.logo}>비트라인</span>
          <div style={S.headerBadge}>📊 3개월 연속 적중</div>
        </div>
      </header>

      {/* ══ 히어로 + 폼 (첫 화면) ══ */}
      <section style={S.hero}>
        <div style={S.heroInner}>

          {/* 왼쪽: 카피 */}
          <div style={S.heroLeft}>
            <div style={S.eyebrow}>🔥 하락장에서도 적중률 89%</div>
            <h1 style={S.h1}>
              매일 아침 받는<br />
              <span style={S.red}>코인선물 시그널</span>
            </h1>
            <p style={S.heroDesc}>
              감으로 하는 투자 이제 그만<br />
              비트코인 44% 폭락 때도<br />
              <strong style={{ color: '#f1f5f9' }}>비트라인 회원은 이미 빠져나왔습니다</strong>
            </p>
            <div style={S.trustRow}>
              {['✅ 가입비 0원', '✅ 1:1 전담 전문가', '✅ 즉시 시그널 제공'].map((t, i) => (
                <span key={i} style={S.trustBadge}>{t}</span>
              ))}
            </div>
          </div>

          {/* 오른쪽: 폼 */}
          <div style={S.formBox}>
            <div style={S.formBoxTop}>
              <div style={S.formTitle}>전문가 1:1 무료 상담 신청</div>
              <div style={S.formSub}>코인선물 처음이어도 · 손실 중이어도 OK</div>
            </div>

            <div style={S.spotsRow}>
              <span style={S.liveDot} />
              <span style={{ fontSize: 12, color: '#94a3b8' }}>잔여 상담</span>
              <strong style={{ color: '#ef4444', fontSize: 13 }}>{spotsLeft}석 남음</strong>
              <div style={S.spotsTrack}>
                <div style={{ ...S.spotsFill, width: `${spotsLeft * 10}%` }} />
              </div>
            </div>

            <form onSubmit={handleSubmit} style={S.form}>
              <div style={S.field}>
                <label style={S.label}>이름</label>
                <input style={S.input} placeholder="홍길동"
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div style={S.field}>
                <label style={S.label}>연락처</label>
                <input style={S.input} placeholder="010-0000-0000"
                  value={form.phone} onChange={handlePhone} inputMode="numeric" />
              </div>
              <label style={S.checkLabel}>
                <input type="checkbox" style={S.check}
                  checked={form.agreePrivacy}
                  onChange={e => setForm(f => ({ ...f, agreePrivacy: e.target.checked }))} />
                [필수] 개인정보 수집 및 이용에 동의합니다
              </label>
              {error && <div style={S.errBox}>{error}</div>}
              <button type="submit" style={S.submitBtn} disabled={loading}>
                {loading ? '신청 중...' : '무료 상담 신청하기 →'}
              </button>
              <p style={S.formNote}>영업일 기준 24시간 이내 전문가가 연락드립니다</p>
            </form>
          </div>

        </div>
      </section>

      {/* 수치 바 */}
      <div style={S.statsBar}>
        {[
          { val: '89%', label: '시그널 적중률' },
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

      {/* 영상 섹션 */}
      {YOUTUBE_ID && (
        <section style={S.videoSec}>
          <div style={S.secInner}>
            <div style={S.secEyebrow}>실제 시그널 적중 영상</div>
            <h2 style={S.secTitle}>직접 확인하세요</h2>
            <div style={S.videoWrap}>
              <iframe
                style={S.videoFrame}
                src={`https://www.youtube.com/embed/${YOUTUBE_ID}?rel=0`}
                title="비트라인 시그널"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* 영상 없을 때 실적 섹션 */}
      {!YOUTUBE_ID && (
        <section style={{ ...S.sec, background: '#080f20' }}>
          <div style={S.secInner}>
            <div style={S.secEyebrow}>이 하락장에서 전문가 시그널</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(2.5rem,9vw,4rem)', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-2px' }}>
                적중률 최대 <span style={S.red}>89%</span>
              </div>
              <div style={{ width: 60, height: 3, background: '#dc2626', borderRadius: 2, margin: '20px auto' }} />
              <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>비트라인 회원은 이미 경험했습니다</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#fbbf24' }}>이젠 <u>당신</u> 차례입니다</div>
            </div>
          </div>
        </section>
      )}

      {/* 문제 공감 */}
      <section style={S.sec}>
        <div style={S.secInner}>
          <div style={S.secEyebrow}>혹시 이런 경험 있으신가요?</div>
          <h2 style={S.secTitle}>코인선물<br />혼자 하면 이렇게 됩니다</h2>
          <div style={S.painGrid}>
            {[
              { icon: '📉', text: '진입했는데 바로 반대로 가는 가격' },
              { icon: '😰', text: '뉴스 보고 들어갔다가 물린 경험' },
              { icon: '🌙', text: '밤새 차트 보다 멘탈 나간 날들' },
              { icon: '❌', text: '수익 났다가 다시 손실로 마감' },
            ].map((p, i) => (
              <div key={i} style={S.painCard}>
                <span style={{ fontSize: 28 }}>{p.icon}</span>
                <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, textAlign: 'center' }}>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 후기 */}
      <section style={{ ...S.sec, background: '#080f20' }}>
        <div style={S.secInner}>
          <div style={S.secEyebrow}>실제 회원 후기</div>
          <h2 style={S.secTitle}>"반신반의 했는데...<br /><span style={{ color: '#22c55e' }}>감사합니다"</span></h2>
          <div style={S.reviewList}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={S.reviewCard}>
                <div style={S.reviewTop}>
                  <div style={S.avatar}>{r.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>{r.name}</div>
                    <div style={{ color: '#fbbf24', fontSize: 12 }}>★★★★★</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontWeight: 900, fontSize: 15, color: r.profit.includes('+') ? '#22c55e' : '#fbbf24' }}>{r.profit}</div>
                </div>
                <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginTop: 10 }}>"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 하단 폼 */}
      <section id="form" style={{ ...S.sec, background: '#060d1f' }}>
        <div style={{ ...S.secInner, maxWidth: 480 }}>
          <div style={S.secEyebrow}>선착순 무료 상담 신청</div>
          <h2 style={{ ...S.secTitle, marginBottom: 24 }}>지금 신청하면<br /><span style={{ color: '#22c55e' }}>급등 시그널 무료 제공</span></h2>
          <div style={S.formBox2}>
            <div style={S.spotsRow}>
              <span style={S.liveDot} />
              <span style={{ fontSize: 12, color: '#94a3b8' }}>잔여 상담</span>
              <strong style={{ color: '#ef4444', fontSize: 13 }}>{spotsLeft}석 남음</strong>
              <div style={S.spotsTrack}>
                <div style={{ ...S.spotsFill, width: `${spotsLeft * 10}%` }} />
              </div>
            </div>
            <form onSubmit={handleSubmit} style={S.form}>
              <div style={S.field}>
                <label style={S.label}>이름</label>
                <input style={S.input} placeholder="홍길동"
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div style={S.field}>
                <label style={S.label}>연락처</label>
                <input style={S.input} placeholder="010-0000-0000"
                  value={form.phone} onChange={handlePhone} inputMode="numeric" />
              </div>
              <label style={S.checkLabel}>
                <input type="checkbox" style={S.check}
                  checked={form.agreePrivacy}
                  onChange={e => setForm(f => ({ ...f, agreePrivacy: e.target.checked }))} />
                [필수] 개인정보 수집 및 이용에 동의합니다
              </label>
              {error && <div style={S.errBox}>{error}</div>}
              <button type="submit" style={S.submitBtn} disabled={loading}>
                {loading ? '신청 중...' : '무료 상담 신청하기 →'}
              </button>
              <p style={S.formNote}>영업일 기준 24시간 이내 전문가가 연락드립니다</p>
            </form>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer style={S.footer}>
        <div style={S.footerInner}>
          <span style={S.footerLogo}>비트라인</span>
          <p style={S.footerTxt}>본 서비스는 투자 참고용 정보를 제공하며, 투자 결과에 대한 책임은 투자자 본인에게 있습니다. 암호화폐 투자는 원금 손실이 발생할 수 있습니다.</p>
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
        <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: '#f1f5f9', marginBottom: 12 }}>신청 완료!</h2>
        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.9, marginBottom: 28 }}>
          <strong style={{ color: '#fbbf24' }}>{name}</strong>님 감사합니다.<br />
          <strong style={{ color: '#22c55e' }}>24시간 이내</strong> 전문가가 직접 연락드립니다.
        </p>
        <div style={{ background: '#0a1628', border: '1px solid #1e293b', borderRadius: 12, padding: '18px 20px', fontSize: 13, color: '#64748b', lineHeight: 2.2 }}>
          <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>다음 단계</div>
          1. 전문가 전화 상담<br />
          2. 1:1 카카오톡 채널 연결<br />
          3. 매일 아침 시그널 수신
        </div>
      </div>
    </div>
  )
}

const S = {
  root: { minHeight: '100vh', background: '#060d1f', color: '#e2e8f0', fontFamily: "'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
  red: { color: '#ef4444' },
  liveDot: { display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80', flexShrink: 0, animation: 'pulse 1.5s infinite' },

  urgentBar: { background: '#7f1d1d', color: '#fecaca', padding: '9px 16px', textAlign: 'center', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 },

  header: { position: 'sticky', top: 0, zIndex: 100, background: 'rgba(6,13,31,.97)', borderBottom: '1px solid #0f172a', backdropFilter: 'blur(12px)' },
  headerInner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 52, maxWidth: 1100, margin: '0 auto' },
  logo: { fontSize: '1.3rem', fontWeight: 900, color: '#f1f5f9' },
  headerBadge: { fontSize: 12, fontWeight: 700, color: '#fbbf24', background: 'rgba(251,191,36,.1)', border: '1px solid rgba(251,191,36,.3)', borderRadius: 20, padding: '4px 12px' },

  hero: { padding: '40px 20px 48px', background: 'linear-gradient(180deg,#060d1f,#08111f)' },
  heroInner: { maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' },
  heroLeft: { flex: '1 1 300px', animation: 'fadeUp .6s ease both' },
  eyebrow: { display: 'inline-block', background: 'rgba(220,38,38,.15)', color: '#fca5a5', border: '1px solid rgba(220,38,38,.3)', borderRadius: 20, padding: '5px 14px', fontSize: 13, fontWeight: 700, marginBottom: 16 },
  h1: { fontSize: 'clamp(2rem,6vw,3rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: 16, color: '#f1f5f9', letterSpacing: '-1px' },
  heroDesc: { fontSize: 15, color: '#94a3b8', lineHeight: 1.9, marginBottom: 24 },
  trustRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  trustBadge: { background: 'rgba(255,255,255,.06)', color: '#94a3b8', fontSize: 12, padding: '5px 12px', borderRadius: 20, border: '1px solid #1e293b' },

  formBox: { flex: '1 1 320px', background: '#0d1829', border: '1px solid #1e293b', borderRadius: 16, padding: '24px 20px', animation: 'fadeUp .6s .1s ease both', boxShadow: '0 8px 40px rgba(0,0,0,.4)' },
  formBox2: { background: '#0d1829', border: '1px solid #1e293b', borderRadius: 16, padding: '24px 20px' },
  formBoxTop: { marginBottom: 16 },
  formTitle: { fontSize: 17, fontWeight: 900, color: '#f1f5f9', marginBottom: 4 },
  formSub: { fontSize: 12, color: '#64748b' },

  spotsRow: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,.07)', border: '1px solid rgba(239,68,68,.18)', borderRadius: 8, padding: '9px 12px', marginBottom: 16 },
  spotsTrack: { width: '100%', height: 3, background: '#1e293b', borderRadius: 2, overflow: 'hidden', marginTop: 2 },
  spotsFill: { height: '100%', background: 'linear-gradient(90deg,#22c55e,#16a34a)', borderRadius: 2, transition: 'width 1s' },

  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 14, fontWeight: 700, color: '#cbd5e1' },
  input: { background: '#060d1f', border: '1px solid #1e293b', borderRadius: 8, padding: '13px 14px', fontSize: 16, color: '#f1f5f9', width: '100%', transition: 'border-color .15s' },
  checkLabel: { display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: '#64748b', cursor: 'pointer', lineHeight: 1.6 },
  check: { accentColor: '#dc2626', cursor: 'pointer', marginTop: 2, flexShrink: 0 },
  errBox: { background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#fca5a5', borderRadius: 8, padding: '10px 14px', fontSize: 13 },
  submitBtn: { background: 'linear-gradient(135deg,#dc2626,#b91c1c)', color: '#fff', border: 'none', borderRadius: 10, padding: '16px', fontSize: 17, fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 20px rgba(220,38,38,.4)', width: '100%', letterSpacing: '-.3px' },
  formNote: { textAlign: 'center', fontSize: 11, color: '#475569' },

  statsBar: { display: 'flex', background: '#080f20', borderTop: '1px solid #0f172a', borderBottom: '1px solid #0f172a' },
  statItem: { flex: 1, padding: '16px 8px', textAlign: 'center', borderRight: '1px solid #0f172a' },
  statVal: { fontSize: 'clamp(.95rem,3vw,1.4rem)', fontWeight: 900, color: '#f1f5f9', marginBottom: 2 },
  statLbl: { color: '#475569', fontSize: 10 },

  sec: { padding: '52px 20px', background: '#060d1f' },
  secInner: { maxWidth: 680, margin: '0 auto' },
  secEyebrow: { display: 'block', textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#86efac', background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 20, padding: '4px 14px', width: 'fit-content', margin: '0 auto 12px' },
  secTitle: { fontSize: 'clamp(1.4rem,5vw,2rem)', fontWeight: 900, textAlign: 'center', marginBottom: 28, lineHeight: 1.3, color: '#f1f5f9' },

  videoSec: { padding: '52px 20px', background: '#080f20' },
  videoWrap: { position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 12, marginTop: 20 },
  videoFrame: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' },

  painGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 },
  painCard: { background: '#0a1628', border: '1px solid #1e293b', borderRadius: 10, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' },

  reviewList: { display: 'flex', flexDirection: 'column', gap: 12 },
  reviewCard: { background: '#060d1f', border: '1px solid #1e293b', borderRadius: 10, padding: '14px' },
  reviewTop: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#0f2a4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#93c5fd', flexShrink: 0 },

  footer: { background: '#04080f', borderTop: '1px solid #0f172a', padding: '28px 20px' },
  footerInner: { maxWidth: 680, margin: '0 auto', textAlign: 'center' },
  footerLogo: { fontSize: '1rem', fontWeight: 900, color: '#334155', display: 'block', marginBottom: 10 },
  footerTxt: { fontSize: 11, color: '#334155', lineHeight: 1.8 },
}
