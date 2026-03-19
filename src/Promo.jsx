import { useState } from 'react'
import logoSvg from './assets/logo.svg'

const NEWS = [
  { tag: '🔥 속보', tagColor: '#ef4444', title: '비트코인, 기관 대량 매수 포착 — 10만 달러 재돌파 초읽기', time: '방금 전', gain: '+8.4%' },
  { tag: '📈 급등', tagColor: '#22c55e', title: '솔라나 생태계 폭발적 성장 — 전문가 "이번 사이클 최대 수혜주"', time: '12분 전', gain: '+21.3%' },
  { tag: '💡 분석', tagColor: '#3b82f6', title: '알트코인 시즌 본격화 신호 포착 — BTC 도미넌스 급락 시작', time: '31분 전', gain: '+15.7%' },
  { tag: '🚀 급등', tagColor: '#22c55e', title: 'XRP, SEC 소송 완전 종결 후 기관 자금 대거 유입 확인', time: '1시간 전', gain: '+34.2%' },
  { tag: '📊 리포트', tagColor: '#a855f7', title: '비트라인 전문가 3월 포트폴리오 — 평균 수익률 +312% 기록', time: '2시간 전', gain: '+312%' },
  { tag: '🌐 글로벌', tagColor: '#f59e0b', title: '미 연준 금리 동결 확정 — 위험자산 랠리 본격화 전망', time: '3시간 전', gain: '+11.9%' },
]

const PROFITS = [
  { coin: 'BTC', name: '비트코인',  icon: '₿', color: '#f7931a', entry: '$62,400', current: '$98,200', rate: '+57.4%',  period: '28일' },
  { coin: 'SOL', name: '솔라나',    icon: '◎', color: '#9945ff', entry: '$118',    current: '$182',    rate: '+54.2%',  period: '14일' },
  { coin: 'XRP', name: 'XRP',       icon: '✕', color: '#00aae4', entry: '$0.52',   current: '$0.86',   rate: '+65.4%',  period: '21일' },
  { coin: 'ETH', name: '이더리움',  icon: 'Ξ', color: '#627eea', entry: '$2,890',  current: '$4,280',  rate: '+48.1%',  period: '30일' },
]

function PromoDBForm() {
  const [form, setForm] = useState({ name: '', phone: '', agreePrivacy: false, agreeMarketing: false })
  const [confirm, setConfirm] = useState(false)
  const [done, setDone] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) { alert('성함과 연락처를 입력해주세요.'); return }
    if (!form.agreePrivacy) { alert('개인정보 수집·이용에 동의해주세요.'); return }
    setConfirm(true)
  }

  const confirmSubmit = () => {
    const prev = JSON.parse(localStorage.getItem('bitline_submissions') || '[]')
    const entry = { ...form, id: Date.now(), createdAt: new Date().toLocaleString('ko-KR') }
    localStorage.setItem('bitline_submissions', JSON.stringify([entry, ...prev]))
    setConfirm(false)
    setDone(true)
  }

  if (confirm) return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#0a1628', border: '1px solid #1e293b', borderRadius: 20, padding: '44px 48px', width: 420, textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.7)' }}>
        <div style={{ fontSize: 36, marginBottom: 14 }}>✋</div>
        <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 20 }}>입력하신 정보가 맞으신가요?</div>
        <div style={{ background: '#060d1f', border: '1px solid #1e3a5f', borderRadius: 14, padding: '22px 28px', marginBottom: 28, lineHeight: 2.2 }}>
          <div style={{ fontSize: 16 }}>성함 &nbsp;<span style={{ color: '#fbbf24', fontWeight: 800 }}>{form.name}</span></div>
          <div style={{ fontSize: 16 }}>번호 &nbsp;<span style={{ color: '#fbbf24', fontWeight: 800 }}>{form.phone}</span></div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>가 맞으신가요??</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setConfirm(false)} style={{ flex: 1, background: 'transparent', border: '1px solid #1e293b', color: '#94a3b8', borderRadius: 10, padding: '14px 0', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>다시 입력</button>
          <button onClick={confirmSubmit} style={{ flex: 2, background: 'linear-gradient(135deg,#dc2626,#991b1b)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 0', fontSize: 15, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 16px rgba(220,38,38,.4)' }}>네, 맞습니다 →</button>
        </div>
      </div>
    </div>
  )

  if (done) return (
    <div id="promo-form" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', padding: '60px 24px' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
      <div style={{ fontWeight: 900, fontSize: 28, marginBottom: 12, color: '#22c55e' }}>신청 완료!</div>
      <div style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.8 }}>입력하신 연락처로 곧 비트라인 전문가가 연락드리겠습니다.</div>
    </div>
  )

  return (
    <div id="promo-form" style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #0d1a2e 0%, #0a1628 100%)',
        border: '2px solid #1e3a5f',
        borderRadius: 24,
        padding: '52px 60px',
        boxShadow: '0 0 80px rgba(59,130,246,.12)',
        textAlign: 'center',
      }}>
        <div style={{ display: 'inline-block', background: 'rgba(220,38,38,.15)', border: '1px solid rgba(220,38,38,.3)', borderRadius: 30, padding: '6px 20px', fontSize: 13, fontWeight: 700, color: '#ef4444', marginBottom: 20, letterSpacing: 1 }}>
          🔥 100명 선착순 · 무료 신청
        </div>
        <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 8, lineHeight: 1.3 }}>
          비트라인 전문가 <span style={{ color: '#ef4444' }}>VIP 시점·정보</span><br />
          <span style={{ color: '#fbbf24' }}>5일간 무료</span> 공개
        </div>
        <div style={{ color: '#64748b', fontSize: 15, marginBottom: 40 }}>지금 바로 신청하고 급등 코인 정보를 무료로 받아보세요.</div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480, margin: '0 auto' }}>
          <input
            style={{ background: '#060d1f', border: '2px solid #1e293b', borderRadius: 12, padding: '18px 22px', color: '#e2e8f0', fontSize: 17, outline: 'none', textAlign: 'center', letterSpacing: '0.5px' }}
            placeholder="성함을 입력해 주세요"
            value={form.name}
            onChange={e => set('name', e.target.value)}
          />
          <input
            style={{ background: '#060d1f', border: '2px solid #1e293b', borderRadius: 12, padding: '18px 22px', color: '#e2e8f0', fontSize: 17, outline: 'none', textAlign: 'center', letterSpacing: '0.5px' }}
            placeholder="연락처  010-0000-0000"
            value={form.phone}
            onChange={e => set('phone', e.target.value)}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '20px 0 4px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#94a3b8', cursor: 'pointer', justifyContent: 'center' }}>
              <input type="checkbox" checked={form.agreePrivacy} onChange={e => set('agreePrivacy', e.target.checked)} style={{ accentColor: '#ef4444', width: 17, height: 17, cursor: 'pointer' }} />
              개인정보 수집·이용 동의 <span style={{ color: '#ef4444', fontWeight: 700 }}>(필수)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#94a3b8', cursor: 'pointer', justifyContent: 'center' }}>
              <input type="checkbox" checked={form.agreeMarketing} onChange={e => set('agreeMarketing', e.target.checked)} style={{ accentColor: '#ef4444', width: 17, height: 17, cursor: 'pointer' }} />
              마케팅 정보 수신 동의 <span style={{ color: '#ef4444', fontWeight: 700 }}>(필수)</span>
            </label>
          </div>

          <button type="submit" style={{
            background: 'linear-gradient(135deg, #dc2626, #991b1b)',
            color: '#fff', border: 'none', borderRadius: 14,
            padding: '20px 0', fontSize: 19, fontWeight: 900, cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(220,38,38,.5)', letterSpacing: '-0.3px',
            marginTop: 8,
          }}>
            🚀 급등 코인 정보 무료로 받기
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Promo() {
  return (
    <div style={{ minHeight: '100vh', background: '#060d1f', color: '#e2e8f0', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* NAV */}
      <header style={{ background: 'rgba(6,13,31,0.97)', borderBottom: '1px solid #0f172a', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64, maxWidth: 1200, margin: '0 auto' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/favicon.svg" alt="비트라인" style={{ height: 32 }} />
            <span style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
              비트<span style={{ color: '#ef4444' }}>라인</span>
            </span>
          </a>
          <button
            onClick={() => document.getElementById('promo-form')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
            무료 신청하기
          </button>
        </div>
      </header>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #0a1a6e 0%, #1a3aad 40%, #0d6efd 70%, #0891b2 100%)',
        padding: '80px 48px 72px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <svg style={{ position: 'absolute', inset: 0, opacity: 0.06 }} width="100%" height="100%">
          {[0,1,2,3,4].map(i => <line key={i} x1="0" y1={i * 80} x2="100%" y2={i * 80} stroke="white" strokeWidth="1"/>)}
        </svg>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 780, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 30, padding: '6px 20px', fontSize: 13, fontWeight: 700, color: '#93c5fd', marginBottom: 24, letterSpacing: 2 }}>
            🔥 BITLINE SPECIAL — 한정 100명
          </div>
          <h1 style={{ fontSize: 54, fontWeight: 900, lineHeight: 1.15, color: 'white', marginBottom: 12, textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            비트코인<br />
            <span style={{ background: 'linear-gradient(90deg,#fff,#93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              1000% 수익률 목표방!!
            </span>
          </h1>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#fbbf24', marginBottom: 20, textShadow: '0 0 20px rgba(251,191,36,.5)' }}>
            지금이 수익의 기회!!
          </div>
          <p style={{ fontSize: 17, color: '#bfdbfe', lineHeight: 1.8, marginBottom: 40 }}>
            비트라인 전문가의 급등 예상 코인 정보!!<br />
            <strong style={{ color: 'white' }}>무료 체험으로 수익률을 직접 확인해 보세요!!</strong>
          </p>
          <button
            onClick={() => document.getElementById('promo-form')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ background: 'linear-gradient(135deg,#dc2626,#be123c)', color: 'white', border: 'none', padding: '18px 52px', borderRadius: 14, fontSize: 18, fontWeight: 900, cursor: 'pointer', boxShadow: '0 8px 32px rgba(220,38,38,.6)', letterSpacing: '-0.3px' }}>
            급등 코인 무료로 받기 →
          </button>
        </div>
      </section>

      {/* 수익 실적 */}
      <section style={{ padding: '72px 48px 0', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ fontSize: 13, color: '#64748b', fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>PROFIT HISTORY</div>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 10 }}>
            비트라인 전문가 <span style={{ color: '#ef4444' }}>실제 수익 실적</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: 15 }}>2026년 1월 ~ 3월 기준 실제 포지션 수익률</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 64 }}>
          {PROFITS.map((p, i) => (
            <div key={i} style={{ background: '#0a1628', border: `1px solid ${p.color}33`, borderTop: `3px solid ${p.color}`, borderRadius: 16, padding: '28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: p.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: p.color, fontWeight: 900 }}>{p.icon}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{p.name}</div>
                  <div style={{ color: '#64748b', fontSize: 12 }}>{p.coin} · {p.period} 보유</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#475569', marginBottom: 8 }}>
                <span>진입가</span><span style={{ color: '#e2e8f0', fontWeight: 700 }}>{p.entry}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#475569', marginBottom: 14 }}>
                <span>현재가</span><span style={{ color: '#e2e8f0', fontWeight: 700 }}>{p.current}</span>
              </div>
              <div style={{ textAlign: 'center', fontSize: 28, fontWeight: 900, color: '#22c55e' }}>{p.rate}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 최신 뉴스 */}
      <section style={{ padding: '0 48px 72px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 13, color: '#64748b', fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>LATEST NEWS</div>
          <h2 style={{ fontSize: 32, fontWeight: 900 }}>
            지금 <span style={{ color: '#ef4444' }}>놓치면 안 되는</span> 코인 뉴스
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 14, marginBottom: 64 }}>
          {NEWS.map((n, i) => (
            <div key={i} style={{ background: '#0a1628', border: '1px solid #0f172a', borderRadius: 14, padding: '20px 22px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0 }}>
                <span style={{ background: n.tagColor + '22', color: n.tagColor, border: `1px solid ${n.tagColor}44`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{n.tag}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.5, marginBottom: 8, color: '#e2e8f0' }}>{n.title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#475569' }}>{n.time}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#22c55e' }}>{n.gain}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DB 폼 */}
      <section style={{ padding: '0 48px 100px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ fontSize: 13, color: '#64748b', fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>FREE APPLY</div>
          <h2 style={{ fontSize: 34, fontWeight: 900, marginBottom: 10 }}>
            지금 바로 <span style={{ color: '#ef4444' }}>무료 신청</span>하세요
          </h2>
          <p style={{ color: '#64748b', fontSize: 15 }}>선착순 100명 마감 시 종료됩니다.</p>
        </div>
        <PromoDBForm />
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'rgba(6,13,31,0.97)', borderTop: '1px solid #0f172a', padding: '24px 48px', textAlign: 'center' }}>
        <span style={{ color: '#334155', fontSize: 12 }}>© 2026 비트라인. 투자에는 위험이 따릅니다.</span>
      </footer>
    </div>
  )
}
