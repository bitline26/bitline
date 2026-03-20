import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

// ─────────────────────────────────────────────────────
//  유틸
// ─────────────────────────────────────────────────────
const fmtKRW = (n) => '₩' + Math.round(n).toLocaleString('ko-KR')

function genOHLC(base, points, vol) {
  const out = []
  let cur = base
  const now = new Date()
  for (let i = points - 1; i >= 0; i--) {
    cur = cur * (1 + (Math.random() - 0.48) * vol)
    const d = new Date(now - i * 3600000)
    out.push({ time: d.getHours().toString().padStart(2, '0') + ':00', price: Math.round(cur) })
  }
  return out
}

// ─────────────────────────────────────────────────────
//  데이터
// ─────────────────────────────────────────────────────
const COINS = [
  { sym: 'BTC',  name: '비트코인', icon: '₿', base: 98420000, vol: 0.012, accent: '#f7931a', chart: '#3b82f6', d1: 2.34  },
  { sym: 'ETH',  name: '이더리움', icon: 'Ξ', base: 4280000,  vol: 0.015, accent: '#627eea', chart: '#22c55e', d1: 1.87  },
  { sym: 'SOL',  name: '솔라나',   icon: '◎', base: 182000,   vol: 0.018, accent: '#9945ff', chart: '#a855f7', d1: 4.21  },
  { sym: 'XRP',  name: 'XRP',      icon: '✕', base: 860,      vol: 0.014, accent: '#00aae4', chart: '#06b6d4', d1: 3.11  },
  { sym: 'DOGE', name: '도지코인', icon: 'Ð', base: 245,      vol: 0.022, accent: '#c2a633', chart: '#eab308', d1: 5.67  },
  { sym: 'BNB',  name: '바이낸스', icon: 'B', base: 890000,   vol: 0.010, accent: '#f3ba2f', chart: '#f59e0b', d1: -0.54 },
  { sym: 'ADA',  name: '에이다',   icon: 'A', base: 680,      accent: '#0033ad', d1: -1.22 },
  { sym: 'AVAX', name: '아발란체', icon: '△', base: 52300,    accent: '#e84142', d1: 2.45  },
  { sym: 'DOT',  name: '폴카닷',   icon: '●', base: 12400,    accent: '#e6007a', d1: 0.98  },
  { sym: 'MATIC',name: '폴리곤',   icon: 'M', base: 1120,     accent: '#8247e5', d1: -0.33 },
]

const NEWS = [
  { cat: 'BTC',   cc: '#f7931a', title: '비트코인, 10만 달러 재돌파 눈앞 — 기관 수요 폭발',    time: '방금 전'  },
  { cat: '속보',  cc: '#ef4444', title: '美 SEC, 이더리움 현물 ETF 추가 승인 검토 착수',        time: '23분 전'  },
  { cat: 'SOL',   cc: '#9945ff', title: '솔라나 생태계 TVL 500억 달러 돌파 — 역대 신기록',     time: '1시간 전' },
  { cat: 'ETH',   cc: '#627eea', title: '이더리움 가스비 사상 최저치 — 레이어2 거래 폭발',      time: '2시간 전' },
]

// ─────────────────────────────────────────────────────
//  신청 폼
// ─────────────────────────────────────────────────────
function DBForm() {
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
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
      <div style={{ background: '#0a1628', border: '1px solid #1e293b', borderRadius: 20, padding: '36px 28px', width: '100%', maxWidth: 380, textAlign: 'center' }}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>✋</div>
        <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 18 }}>입력하신 정보가 맞으신가요?</div>
        <div style={{ background: '#060d1f', border: '1px solid #1e3a5f', borderRadius: 12, padding: '18px 20px', marginBottom: 24, lineHeight: 2 }}>
          <div style={{ fontSize: 15 }}>성함 &nbsp;<span style={{ color: '#fbbf24', fontWeight: 800 }}>{form.name}</span></div>
          <div style={{ fontSize: 15 }}>번호 &nbsp;<span style={{ color: '#fbbf24', fontWeight: 800 }}>{form.phone}</span></div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>가 맞으신가요?</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setConfirm(false)} style={{ flex: 1, background: 'transparent', border: '1px solid #1e293b', color: '#94a3b8', borderRadius: 10, padding: '13px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>다시 입력</button>
          <button onClick={confirmSubmit} style={{ flex: 2, background: 'linear-gradient(135deg,#dc2626,#991b1b)', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 0', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>네, 맞습니다 →</button>
        </div>
      </div>
    </div>
  )

  if (done) return (
    <div id="apply-form" style={{ padding: '32px 20px', textAlign: 'center' }}>
      <div style={{ background: '#0a1628', border: '1px solid #1e293b', borderRadius: 18, padding: '40px 24px' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
        <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 8 }}>신청 완료!</div>
        <div style={{ color: '#94a3b8', fontSize: 14 }}>입력하신 연락처로 곧 안내드리겠습니다.</div>
      </div>
    </div>
  )

  return (
    <div id="apply-form" style={{ padding: '0 16px 32px' }}>
      <div style={{ background: '#0d1a2e', border: '1.5px solid #1e3a5f', borderRadius: 18, padding: '28px 20px', boxShadow: '0 0 40px rgba(59,130,246,.07)' }}>
        <div style={{ fontSize: 17, fontWeight: 900, textAlign: 'center', marginBottom: 20, lineHeight: 1.5 }}>
          전문가 <span style={{ color: '#ef4444' }}>VIP 시점·정보</span> 5일 무료<br />
          <span style={{ color: '#fbbf24', fontSize: 14 }}>선착순 100명</span>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            style={{ background: '#060d1f', border: '1px solid #1e293b', borderRadius: 10, padding: '14px 16px', color: '#e2e8f0', fontSize: 15, outline: 'none', width: '100%', boxSizing: 'border-box' }}
            placeholder="이름"
            value={form.name}
            onChange={e => set('name', e.target.value)}
          />
          <input
            style={{ background: '#060d1f', border: '1px solid #1e293b', borderRadius: 10, padding: '14px 16px', color: '#e2e8f0', fontSize: 15, outline: 'none', width: '100%', boxSizing: 'border-box' }}
            placeholder="연락처  010-0000-0000"
            value={form.phone}
            onChange={e => set('phone', e.target.value)}
          />
          <button type="submit" style={{ background: 'linear-gradient(135deg,#dc2626,#991b1b)', color: '#fff', border: 'none', padding: '15px 0', borderRadius: 10, fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 16px rgba(220,38,38,.4)', width: '100%' }}>
            급등 코인 정보 무료받기
          </button>
        </form>
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94a3b8', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.agreePrivacy} onChange={e => set('agreePrivacy', e.target.checked)} style={{ accentColor: '#ef4444', width: 16, height: 16 }} />
            개인정보 수집·이용 동의 <span style={{ color: '#ef4444' }}>(필수)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94a3b8', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.agreeMarketing} onChange={e => set('agreeMarketing', e.target.checked)} style={{ accentColor: '#ef4444', width: 16, height: 16 }} />
            마케팅 정보 수신 동의 <span style={{ color: '#ef4444' }}>(필수)</span>
          </label>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────
//  코인 차트 (모바일)
// ─────────────────────────────────────────────────────
function MiniChart({ coin }) {
  const [data] = useState(() => genOHLC(coin.base, 24, coin.vol || 0.012))
  const [live, setLive] = useState(coin.base)

  useEffect(() => {
    const id = setInterval(() => setLive(p => Math.round(p * (1 + (Math.random() - 0.5) * 0.003))), 2200)
    return () => clearInterval(id)
  }, [])

  const chg = ((live - coin.base) / coin.base * 100 + coin.d1).toFixed(2)
  const up = chg >= 0

  return (
    <div style={{ background: '#0a1628', border: '1px solid #0f172a', borderRadius: 14, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: (coin.accent || '#3b82f6') + '22', color: coin.accent || '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, border: `1px solid ${(coin.accent || '#3b82f6')}44` }}>
            {coin.icon}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14 }}>{coin.name}</div>
            <div style={{ color: '#64748b', fontSize: 11 }}>{coin.sym}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>{fmtKRW(live)}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: up ? '#22c55e' : '#ef4444' }}>
            {up ? '▲ +' : '▼ '}{Math.abs(chg)}%
          </div>
        </div>
      </div>
      {coin.chart && (
        <div style={{ height: 60 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`mg${coin.sym}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={coin.chart} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={coin.chart} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="price" stroke={coin.chart} strokeWidth={2}
                fill={`url(#mg${coin.sym})`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────
//  메인 모바일 앱
// ─────────────────────────────────────────────────────
export default function AppMobile() {
  const [btcLive, setBtcLive] = useState(98420000)
  const [menuOpen, setMenuOpen] = useState(false)
  const [tickerPaused, setTickerPaused] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setBtcLive(p => Math.round(p * (1 + (Math.random() - 0.5) * 0.003))), 2500)
    return () => clearInterval(id)
  }, [])

  const btcChg = ((btcLive - 98420000) / 98420000 * 100 + 2.34).toFixed(2)
  const btcUp = btcChg >= 0

  return (
    <div style={{ minHeight: '100vh', background: '#060d1f', color: '#e2e8f0', fontFamily: "'Segoe UI', system-ui, sans-serif", overflowX: 'hidden', width: '100%' }}>

      {/* ──── NAV ──── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 200, background: 'rgba(6,13,31,0.97)', borderBottom: '1px solid #0f172a', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 52 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <img src="/favicon.svg" alt="비트라인" style={{ height: 28 }} />
            <span style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.5px', color: '#f1f5f9' }}>비트라인</span>
          </a>
          <button
            style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
            onClick={() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            신청하기
          </button>
        </div>
      </header>

      {/* ──── TICKER ──── */}
      <div style={{ background: '#080f20', borderBottom: '1px solid #0f172a', overflow: 'hidden', padding: '7px 0' }}>
        <div style={{ display: 'inline-flex', gap: 36, animation: 'ticker 28s linear infinite', whiteSpace: 'nowrap' }}>
          {[...COINS, ...COINS].map((c, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12 }}>
              <span style={{ color: c.accent, fontWeight: 700 }}>{c.sym}</span>
              <span style={{ color: '#e2e8f0' }}>{c.sym === 'BTC' ? fmtKRW(btcLive) : fmtKRW(c.base)}</span>
              <span style={{ color: c.d1 >= 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                {c.d1 >= 0 ? '▲' : '▼'} {Math.abs(c.d1).toFixed(2)}%
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ──── HERO ──── */}
      <section style={{ padding: '36px 16px 28px', background: 'linear-gradient(180deg,#060d1f 0%,#080f22 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* 배경 글로우 */}
        <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, background: 'radial-gradient(circle, rgba(220,38,38,.15) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative' }}>
          {/* 배지 */}
          <div style={{ display: 'inline-block', background: 'rgba(220,38,38,.15)', color: '#fca5a5', border: '1px solid rgba(220,38,38,.3)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 600, marginBottom: 16 }}>
            🔥 실시간 코인 수익률 분석 서비스
          </div>

          {/* 타이틀 */}
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, lineHeight: 1.25, marginBottom: 14, letterSpacing: '-0.5px' }}>
            코인 시장의 모든 정보,<br />
            <span style={{ color: '#ef4444', fontSize: '2.2rem' }}>비트라인</span>에서 한눈에
          </h1>

          <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.7, marginBottom: 24 }}>
            실시간 시세 · 수익률 분석 · 최신 뉴스<br />
            전문 트레이더가 선택하는 암호화폐 정보 플랫폼
          </p>

          {/* BTC 실시간 배너 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#0d1626', border: '1px solid #1e293b', borderRadius: 12, padding: '12px 16px', marginBottom: 24, flexWrap: 'wrap' }}>
            <span style={{ color: '#f7931a', fontWeight: 800, fontSize: 16 }}>₿</span>
            <span style={{ fontWeight: 700, fontSize: 13 }}>BTC / KRW</span>
            <span style={{ fontWeight: 900, fontSize: 16 }}>{fmtKRW(btcLive)}</span>
            <span style={{ color: btcUp ? '#22c55e' : '#ef4444', fontWeight: 700, fontSize: 13 }}>
              {btcUp ? '▲ +' : '▼ '}{Math.abs(btcChg)}%
            </span>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 7px #22c55e', animation: 'pulse 1.5s infinite', display: 'inline-block' }} />
            <span style={{ color: '#64748b', fontSize: 11 }}>실시간</span>
          </div>

          {/* CTA 버튼 */}
          <button
            style={{ width: '100%', background: 'linear-gradient(135deg,#dc2626,#991b1b)', color: '#fff', border: 'none', padding: '15px 0', borderRadius: 10, fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 20px rgba(220,38,38,.4)' }}
            onClick={() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            지금 무료로 시작하기
          </button>
        </div>
      </section>

      {/* ──── 3가지 혜택 ──── */}
      <section style={{ padding: '0 16px 28px' }}>
        {[
          { num: '01', title: '비트라인 VIP 혜택', desc: '전문가만의 독점 VIP 정보와 혜택을 지금 바로 무료로 경험하세요.' },
          { num: '02', title: '전문가 시그널', desc: '실시간 대응 단타방 / 단체로 대응 스윙방 2가지 타입 시그널 제공' },
          { num: '03', title: '전문가 뉴스방', desc: '전문가가 직접 파악한 시장 정보와 핵심 뉴스를 무료로 제공합니다.' },
        ].map((item) => (
          <div key={item.num} style={{ borderLeft: '3px solid #3b82f6', paddingLeft: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#3b82f6', letterSpacing: 2, marginBottom: 4 }}>{item.num}</div>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4, color: '#f1f5f9' }}>{item.title}</div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{item.desc}</div>
          </div>
        ))}
      </section>

      {/* ──── 신청 폼 ──── */}
      <DBForm />

      {/* ──── 프로모 배너 ──── */}
      <div style={{ padding: '0 16px 28px' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 18, background: 'linear-gradient(135deg, #0a1a6e 0%, #1a3aad 50%, #0891b2 100%)', padding: '36px 24px' }}>
          {/* 배경 격자 */}
          <svg style={{ position: 'absolute', inset: 0, opacity: 0.06 }} width="100%" height="100%">
            {[0,1,2,3].map(i => <line key={i} x1="0" y1={i * 70} x2="100%" y2={i * 70} stroke="white" strokeWidth="1"/>)}
          </svg>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#93c5fd', marginBottom: 10, letterSpacing: 2 }}>🔥 BITLINE SPECIAL</div>
            <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.2, color: 'white', marginBottom: 8 }}>
              비트코인<br />
              <span style={{ background: 'linear-gradient(90deg,#fff,#93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                1000% 수익률 목표방!!
              </span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fbbf24', marginBottom: 16 }}>지금이 수익의 기회!!</div>
            <div style={{ fontSize: 13, color: '#bfdbfe', lineHeight: 1.7, marginBottom: 24 }}>
              비트라인 전문가의 급등 예상 코인 정보!!<br />
              <strong style={{ color: 'white' }}>무료 체험으로 확인해 보세요!!</strong>
            </div>
            <button
              onClick={() => window.location.href = '/promo'}
              style={{ width: '100%', background: 'linear-gradient(135deg,#dc2626,#be123c)', color: 'white', border: 'none', padding: '14px 0', borderRadius: 10, fontSize: 15, fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 20px rgba(220,38,38,.5)' }}
            >
              급등 코인 무료로 받기 →
            </button>
          </div>
        </div>
      </div>

      {/* ──── 코인 시세 카드 ──── */}
      <section style={{ padding: '0 16px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
          <span style={{ fontWeight: 700, fontSize: 15 }}>실시간 코인 시세</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {COINS.slice(0, 6).map((coin) => (
            <MiniChart key={coin.sym} coin={coin} />
          ))}
        </div>
      </section>

      {/* ──── PNL 차트 이미지 ──── */}
      <section style={{ padding: '0 16px 20px' }}>
        <div style={{ background: '#0a1628', border: '1px solid #0f172a', borderRadius: 14, padding: '18px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>코인 PNL 그래프</span>
          </div>
          <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #1e293b' }}>
            <img src="/src/assets/pnl_chart.jpg" alt="코인 PNL 그래프" style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* ──── 퀀트 차트 이미지 ──── */}
      <section style={{ padding: '0 16px 20px' }}>
        <div style={{ background: '#0a1628', border: '1px solid #0f172a', borderRadius: 14, padding: '18px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>전문가 퀀트 트레이딩 포지션 지표</span>
          </div>
          <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #1e293b' }}>
            <img src="/src/assets/quant_chart.jpg" alt="퀀트 트레이딩 포지션 지표" style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* ──── 출금 이력 ──── */}
      <section style={{ padding: '0 16px 28px' }}>
        <div style={{ background: '#0a1628', border: '1px solid #0f172a', borderRadius: 14, padding: '18px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>전문가의 1월 ~ 3월 출금 이력</span>
          </div>
          <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #1e293b' }}>
            <img src="/src/assets/withdrawal_history.jpg" alt="전문가 출금 이력" style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* ──── 뉴스 ──── */}
      <section style={{ padding: '0 16px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
          <span style={{ fontWeight: 700, fontSize: 15 }}>최신 코인 뉴스</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {NEWS.map((n, i) => (
            <div key={i} style={{ background: '#0a1628', border: '1px solid #0f172a', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ background: n.cc + '22', color: n.cc, border: `1px solid ${n.cc}44`, borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>{n.cat}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5, color: '#e2e8f0', marginBottom: 4 }}>{n.title}</div>
                <div style={{ fontSize: 11, color: '#475569' }}>{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──── 왜 비트라인? ──── */}
      <section style={{ padding: '0 16px 28px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 20, fontWeight: 900, marginBottom: 20 }}>
          왜 <span style={{ color: '#ef4444' }}>비트라인</span>인가?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { icon: '⚡', title: '초고속 실시간 시세', desc: '0.1초 단위 업데이트' },
            { icon: '📊', title: '전문 수익률 분석', desc: '24H·7D·30D 비교 분석' },
            { icon: '📰', title: '핵심 코인 뉴스', desc: 'AI 선별 뉴스 제공' },
            { icon: '🔔', title: '맞춤형 가격 알림', desc: '목표가 도달 즉시 알림' },
            { icon: '🤖', title: 'AI 시장 분석', desc: 'AI 기반 투자 신호' },
            { icon: '🔒', title: '안전한 서비스', desc: '개인정보 보호 최우선' },
          ].map((f, i) => (
            <div key={i} style={{ background: '#0a1628', border: '1px solid #0f172a', borderRadius: 12, padding: '18px 14px' }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 5, color: '#f1f5f9' }}>{f.title}</div>
              <div style={{ color: '#64748b', fontSize: 11, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ──── CTA ──── */}
      <section style={{ padding: '0 16px 40px', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg,#0d0505,#060d1f)', border: '1px solid #1e293b', borderRadius: 18, padding: '36px 20px' }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 10 }}>지금 바로 시작하세요</h2>
          <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 24 }}>1만 회원이 선택한 코인 정보 플랫폼 — 비트라인</p>
          <button
            style={{ width: '100%', background: 'linear-gradient(135deg,#dc2626,#991b1b)', color: '#fff', border: 'none', padding: '15px 0', borderRadius: 10, fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 20px rgba(220,38,38,.4)' }}
            onClick={() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            무료로 시작하기
          </button>
        </div>
      </section>

      {/* ──── FOOTER ──── */}
      <footer style={{ background: 'rgba(6,13,31,0.97)', borderTop: '1px solid #0f172a', padding: '20px 16px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <img src="/favicon.svg" alt="비트라인" style={{ height: 24 }} />
          <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f1f5f9' }}>비트라인</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 16px', marginBottom: 14 }}>
          {['실시간 시세', '수익률 분석', '코인 차트', '뉴스', '이용약관', '개인정보처리방침'].map(m => (
            <a key={m} href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: 11 }}>{m}</a>
          ))}
        </div>
        <div style={{ color: '#334155', fontSize: 11 }}>© 2026 비트라인. 투자에는 위험이 따릅니다.</div>
      </footer>

      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes pulse  { 0%,100% { opacity:1; } 50% { opacity:.4; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #060d1f !important; overflow-x: hidden; }
        #root { width: 100% !important; max-width: 100% !important; border: none !important; text-align: left !important; min-height: unset !important; display: block !important; overflow-x: hidden; }
        img { max-width: 100%; }
      `}</style>
    </div>
  )
}
