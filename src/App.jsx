import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
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
    out.push({
      time: d.getHours().toString().padStart(2, '0') + ':00',
      price: Math.round(cur),
    })
  }
  return out
}

// ─────────────────────────────────────────────────────
//  데이터
// ─────────────────────────────────────────────────────
const COINS = [
  { sym: 'BTC',  name: '비트코인', icon: '₿', base: 98420000, vol: 0.012, accent: '#f7931a', chart: '#3b82f6', d1: 2.34,  d7: 8.21,  d30: 24.5,  cap: '1,892조' },
  { sym: 'ETH',  name: '이더리움', icon: 'Ξ', base: 4280000,  vol: 0.015, accent: '#627eea', chart: '#22c55e', d1: 1.87,  d7: 5.44,  d30: 18.3,  cap: '514조'   },
  { sym: 'SOL',  name: '솔라나',   icon: '◎', base: 182000,   vol: 0.018, accent: '#9945ff', chart: '#a855f7', d1: 4.21,  d7: 12.7,  d30: 38.9,  cap: '85조'    },
  { sym: 'XRP',  name: 'XRP',      icon: '✕', base: 860,      vol: 0.014, accent: '#00aae4', chart: '#06b6d4', d1: 3.11,  d7: 7.80,  d30: 15.2,  cap: '49조'    },
  { sym: 'DOGE', name: '도지코인', icon: 'Ð', base: 245,      vol: 0.022, accent: '#c2a633', chart: '#eab308', d1: 5.67,  d7: 21.3,  d30: 52.1,  cap: '36조'    },
  { sym: 'BNB',  name: '바이낸스', icon: 'B', base: 890000,   vol: 0.010, accent: '#f3ba2f', chart: '#f59e0b', d1: -0.54, d7: -2.11, d30: 6.7,   cap: '137조'   },
]

const TICKER_ALL = [
  ...COINS,
  { sym: 'ADA',  name: '에이다',   icon: 'A', base: 680,   accent: '#0033ad', d1: -1.22 },
  { sym: 'AVAX', name: '아발란체', icon: '△', base: 52300, accent: '#e84142', d1:  2.45 },
  { sym: 'DOT',  name: '폴카닷',   icon: '●', base: 12400, accent: '#e6007a', d1:  0.98 },
  { sym: 'MATIC',name: '폴리곤',   icon: 'M', base: 1120,  accent: '#8247e5', d1: -0.33 },
]

const NEWS = [
  { cat: 'BTC',  cc: '#f7931a', title: '비트코인, 10만 달러 재돌파 눈앞 — 기관 수요 폭발',        time: '방금 전'   },
  { cat: '속보', cc: '#ef4444', title: '美 SEC, 이더리움 현물 ETF 추가 승인 검토 착수',            time: '23분 전'   },
  { cat: 'SOL',  cc: '#9945ff', title: '솔라나 생태계 TVL 500억 달러 돌파 — 역대 신기록',         time: '1시간 전'  },
  { cat: 'ETH',  cc: '#627eea', title: '이더리움 가스비 사상 최저치 — 레이어2 거래 폭발',          time: '2시간 전'  },
  { cat: '분석', cc: '#3b82f6', title: '2026 알트시즌 본격화 신호 — 도미넌스 지표 급락',           time: '3시간 전'  },
  { cat: '글로벌',cc:'#22c55e', title: '전 세계 암호화폐 시가총액 3조 달러 돌파 재확인',           time: '4시간 전'  },
]

const STATS_TOP = [
  { value: '185만+', label: '가입 회원수' },
  { value: '200+',   label: '추적 국가수' },
  { value: '3,200+', label: '지원 코인수' },
  { value: '24/7',   label: '실시간 서비스' },
]

const TABS = ['1일', '1주', '1달', '3달', '1년']

// ─────────────────────────────────────────────────────
//  툴팁
// ─────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '8px 14px' }}>
      <p style={{ color: '#94a3b8', fontSize: 11, marginBottom: 4 }}>{label}</p>
      <p style={{ color: '#3b82f6', fontWeight: 700, fontSize: 14 }}>{fmtKRW(payload[0].value)}</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────
//  차트 카드
// ─────────────────────────────────────────────────────
function CoinChart({ coin, compact = false }) {
  const [tab, setTab] = useState(0)
  const [data, setData] = useState(() => genOHLC(coin.base, 24, coin.vol))
  const [live, setLive] = useState(coin.base)

  useEffect(() => {
    const pts = [24, 48, 72, 90, 120][tab]
    setData(genOHLC(coin.base, pts, coin.vol * (1 + tab * 0.25)))
  }, [tab])

  useEffect(() => {
    const id = setInterval(() => setLive(p => Math.round(p * (1 + (Math.random() - 0.5) * 0.003))), 2200)
    return () => clearInterval(id)
  }, [])

  const chg = ((live - coin.base) / coin.base * 100 + coin.d1).toFixed(2)
  const up = chg >= 0

  return (
    <div style={S.card}>
      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ ...S.iconLg, background: coin.accent + '22', color: coin.accent, border: `1px solid ${coin.accent}44` }}>
            {coin.icon}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: compact ? 15 : 18 }}>{coin.name}</div>
            <div style={{ color: '#64748b', fontSize: 12 }}>{coin.sym} / KRW</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 900, fontSize: compact ? 16 : 24, letterSpacing: '-0.5px' }}>{fmtKRW(live)}</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: up ? '#22c55e' : '#ef4444' }}>
            {up ? '▲ +' : '▼ '}{Math.abs(chg)}%
          </div>
        </div>
      </div>

      {/* tabs */}
      {!compact && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              padding: '5px 13px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              border: '1px solid', transition: 'all .15s',
              background: tab === i ? '#1d4ed8' : 'transparent',
              color: tab === i ? '#fff' : '#64748b',
              borderColor: tab === i ? '#1d4ed8' : '#1e293b',
            }}>{t}</button>
          ))}
        </div>
      )}

      {/* area chart */}
      <div style={{ height: compact ? 140 : 220, minWidth: 0, overflow: 'hidden' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`g${coin.sym}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={coin.chart} stopOpacity={0.35} />
                <stop offset="95%" stopColor={coin.chart} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            {!compact && (
              <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} />
            )}
            <YAxis
              tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false}
              tickFormatter={v => v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v}
              width={52}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="price" stroke={coin.chart} strokeWidth={2.5}
              fill={`url(#g${coin.sym})`} dot={false} activeDot={{ r: 5, fill: coin.chart, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────
//  메인
// ─────────────────────────────────────────────────────
export default function App() {
  const [btcLive, setBtcLive] = useState(98420000)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setBtcLive(p => Math.round(p * (1 + (Math.random() - 0.5) * 0.003))), 2500)
    return () => clearInterval(id)
  }, [])

  const btcChg = ((btcLive - 98420000) / 98420000 * 100 + 2.34).toFixed(2)

  // 수익률 막대 차트 데이터
  const returnData = COINS.map(c => ({ name: c.sym, d1: c.d1, d7: c.d7, d30: c.d30 }))

  return (
    <div style={S.root}>

      {/* ──── NAV ──── */}
      <header style={S.header}>
        <div style={S.headerInner}>
          <a href="#" style={S.logo}>
            비트<span style={{ color: '#ef4444' }}>라인</span>
          </a>
          <nav style={S.navLinks}>
            {['시세', '수익률', '차트', '뉴스', '분석리포트', '고객센터'].map(m => (
              <a key={m} href="#" style={S.navA}>{m}</a>
            ))}
          </nav>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button style={S.btnGhost}>로그인</button>
            <button style={S.btnRed}>시작하기</button>
          </div>
        </div>
      </header>

      {/* ──── TICKER ──── */}
      <div style={S.ticker}>
        <div style={S.tickerTrack}>
          {[...TICKER_ALL, ...TICKER_ALL].map((c, i) => (
            <span key={i} style={S.tickerChip}>
              <span style={{ color: c.accent, fontWeight: 700, minWidth: 44 }}>{c.sym}</span>
              <span style={{ color: '#e2e8f0' }}>{c.sym === 'BTC' ? fmtKRW(btcLive) : fmtKRW(c.base)}</span>
              <span style={{ color: c.d1 >= 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                {c.d1 >= 0 ? '▲' : '▼'} {Math.abs(c.d1).toFixed(2)}%
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ──── HERO ──── */}
      <section style={S.hero}>
        <div style={S.heroGlow} />
        <div style={S.heroContent}>
          <div style={S.heroBadge}>🔥 실시간 코인 수익률 분석 서비스</div>
          <h1 style={S.heroH1}>
            코인 시장의 모든 정보,<br />
            <span style={S.heroRed}>비트라인</span>에서 한눈에
          </h1>
          <p style={S.heroSub}>
            실시간 시세 · 수익률 분석 · 최신 뉴스 · AI 동향 리포트<br />
            전문 트레이더가 선택하는 암호화폐 정보 플랫폼
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button style={S.heroBtnPrimary}>지금 무료로 시작하기</button>
            <button style={S.heroBtnSec}>수익률 분석 보기 →</button>
          </div>

          {/* 실시간 BTC 배너 */}
          <div style={S.btcBanner}>
            <span style={{ color: '#f7931a', fontWeight: 800, fontSize: 18 }}>₿</span>
            <span style={{ fontWeight: 700, fontSize: 14 }}>BTC / KRW</span>
            <span style={{ fontWeight: 900, fontSize: 20 }}>{fmtKRW(btcLive)}</span>
            <span style={{ color: btcChg >= 0 ? '#22c55e' : '#ef4444', fontWeight: 700, fontSize: 15 }}>
              {btcChg >= 0 ? '▲ +' : '▼ '}{Math.abs(btcChg)}%
            </span>
            <span style={{ ...S.liveDot }} />
            <span style={{ color: '#64748b', fontSize: 12 }}>실시간</span>
          </div>
        </div>
      </section>


      {/* ──── 메인 3단 ──── */}
      <div style={S.mainWrap}>

        {/* 중앙: 차트 */}
        <div style={S.colCenter}>

          {/* BTC / ETH 차트 */}
          {COINS.slice(0, 2).map(c => <CoinChart key={c.sym} coin={c} />)}

          {/* 수익률 막대 차트 */}
          <div style={S.card}>
            <div style={S.secTitle}><span style={{ ...S.dot, background: '#3b82f6' }} />코인별 수익률 비교</div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              {[
                { label: '24시간', color: '#3b82f6' },
                { label: '7일',    color: '#22c55e' },
                { label: '30일',   color: '#f59e0b' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color, display: 'inline-block' }} />
                  {l.label}
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={returnData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} tickLine={false} axisLine={false}
                  tickFormatter={v => v + '%'} width={40} />
                <Tooltip formatter={(v, n) => [v.toFixed(2) + '%', n]} contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }} labelStyle={{ color: '#94a3b8' }} itemStyle={{ color: '#e2e8f0' }} />
                <Bar dataKey="d1"  name="24시간" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="d7"  name="7일"    fill="#22c55e" radius={[3, 3, 0, 0]} />
                <Bar dataKey="d30" name="30일"   fill="#f59e0b" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 코인 테이블 */}
          <div style={S.card}>
            <div style={S.secTitle}><span style={{ ...S.dot, background: '#3b82f6' }} />전체 시세 현황</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['#', '코인', '현재가', '24시간', '7일', '30일', '시가총액'].map(h => (
                      <th key={h} style={S.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COINS.map((c, idx) => (
                    <tr key={c.sym} style={S.tr}>
                      <td style={{ ...S.td, color: '#475569', width: 36 }}>{idx + 1}</td>
                      <td style={S.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ ...S.iconSm, background: c.accent + '22', color: c.accent }}>{c.icon}</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</div>
                            <div style={{ color: '#475569', fontSize: 11 }}>{c.sym}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...S.td, fontWeight: 700 }}>{fmtKRW(c.base)}</td>
                      <td style={S.td}><Pill v={c.d1} /></td>
                      <td style={S.td}><Pill v={c.d7} /></td>
                      <td style={S.td}><Pill v={c.d30} /></td>
                      <td style={{ ...S.td, color: '#64748b', fontSize: 13 }}>{c.cap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 우측: 사이드바 */}
        <aside style={S.sidebar}>

          {/* 급등 TOP 5 */}
          <div style={S.card}>
            <div style={S.secTitle}><span style={{ ...S.dot, background: '#22c55e' }} />급등 TOP 5</div>
            {[...COINS].sort((a, b) => b.d1 - a.d1).slice(0, 5).map((c, i) => (
              <div key={c.sym} style={{ ...S.row, borderTop: i === 0 ? 'none' : '1px solid #1e293b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ color: '#475569', fontSize: 12, minWidth: 16 }}>{i + 1}</span>
                  <div style={{ ...S.iconSm, background: c.accent + '22', color: c.accent }}>{c.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{c.name}</div>
                    <div style={{ color: '#475569', fontSize: 11 }}>{c.sym}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{fmtKRW(c.base)}</div>
                  <div style={{ color: '#22c55e', fontWeight: 700, fontSize: 13 }}>▲ +{c.d1.toFixed(2)}%</div>
                </div>
              </div>
            ))}
          </div>

          {/* 뉴스 */}
          <div style={S.card}>
            <div style={S.secTitle}><span style={{ ...S.dot, background: '#f59e0b' }} />최신 뉴스</div>
            {NEWS.map((n, i) => (
              <div key={i} style={{ ...S.newsItem, borderTop: i === 0 ? 'none' : '1px solid #1e293b' }}>
                <span style={{ ...S.tag, background: n.cc + '22', color: n.cc }}>{n.cat}</span>
                <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5, margin: '6px 0 4px', color: '#e2e8f0' }}>
                  {n.title}
                </p>
                <span style={{ color: '#475569', fontSize: 11 }}>{n.time}</span>
              </div>
            ))}
          </div>

          {/* SOL 차트 컴팩트 */}
          <CoinChart coin={COINS[2]} compact />

          {/* 프로모 배너 */}
          <div style={S.promoBanner}>
            <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>🎁 신규 가입 혜택</div>
            <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8 }}>프리미엄 분석 리포트<br />30일 무료 제공</div>
            <button style={{ ...S.btnRed, width: '100%', padding: '10px 0' }}>지금 받기</button>
          </div>

        </aside>
      </div>

      {/* ──── 왜 비트라인? ──── */}
      <section style={S.whySection}>
        <h2 style={S.whyTitle}>왜 <span style={{ color: '#ef4444' }}>비트라인</span>인가?</h2>
        <div style={S.whyGrid}>
          {[
            { icon: '⚡', title: '초고속 실시간 시세', desc: '0.1초 단위 업데이트로 시장 변화를 놓치지 마세요' },
            { icon: '📊', title: '전문 수익률 분석', desc: '24시간·7일·30일 수익률을 한눈에 비교 분석' },
            { icon: '📰', title: '핵심 코인 뉴스', desc: '전 세계 코인 뉴스를 AI가 선별해서 제공' },
            { icon: '🔔', title: '맞춤형 가격 알림', desc: '원하는 가격에 도달하면 즉시 알림 발송' },
            { icon: '🤖', title: 'AI 시장 동향 분석', desc: 'AI 기반 시장 동향 및 투자 신호 분석 제공' },
            { icon: '🔒', title: '안전한 정보 서비스', desc: '개인정보 보호 및 데이터 보안 최우선' },
          ].map((f, i) => (
            <div key={i} style={S.featureCard}>
              <div style={S.featureIcon}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{f.title}</div>
              <div style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ──── CTA ──── */}
      <section style={S.cta}>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 14 }}>
          지금 바로 시작하세요
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: 28, fontSize: 15 }}>
          185만 회원이 선택한 코인 정보 플랫폼 — 비트라인
        </p>
        <button style={{ ...S.heroBtnPrimary, fontSize: 16, padding: '14px 48px' }}>
          무료로 시작하기
        </button>
      </section>

      {/* ──── FOOTER ──── */}
      <footer style={S.footer}>
        <div style={S.footerTop}>
          <div>
            <div style={{ ...S.logo, fontSize: 22, marginBottom: 10 }}>
              비트<span style={{ color: '#ef4444' }}>라인</span>
            </div>
            <p style={{ color: '#475569', fontSize: 13, lineHeight: 1.7, maxWidth: 280 }}>
              암호화폐 시세 및 수익률 정보 서비스.<br />
              본 서비스는 투자 권유가 아닙니다.
            </p>
          </div>
          {[
            { title: '서비스', links: ['실시간 시세', '수익률 분석', '코인 차트', '뉴스'] },
            { title: '회사',   links: ['회사소개', '이용약관', '개인정보처리방침', '고객센터'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: '#e2e8f0' }}>{col.title}</div>
              {col.links.map(l => (
                <div key={l} style={{ color: '#475569', fontSize: 13, marginBottom: 10, cursor: 'pointer' }}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={S.footerBot}>
          <span>© 2026 비트라인. All rights reserved.</span>
          <span style={{ color: '#334155' }}>투자에는 위험이 따릅니다. 신중하게 결정하세요.</span>
        </div>
      </footer>

      <style>{GLOBAL_CSS}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────
//  뱃지
// ─────────────────────────────────────────────────────
function Pill({ v }) {
  const up = v >= 0
  return (
    <span style={{
      display: 'inline-block',
      background: up ? 'rgba(34,197,94,.12)' : 'rgba(239,68,68,.12)',
      color: up ? '#22c55e' : '#ef4444',
      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
    }}>
      {up ? '+' : ''}{v.toFixed(2)}%
    </span>
  )
}

// ─────────────────────────────────────────────────────
//  스타일
// ─────────────────────────────────────────────────────
const S = {
  root: { minHeight: '100vh', background: '#060d1f', color: '#e2e8f0', fontFamily: "'Segoe UI', system-ui, sans-serif" },

  // header
  header: { position: 'sticky', top: 0, zIndex: 200, background: 'rgba(6,13,31,0.97)', borderBottom: '1px solid #0f172a', backdropFilter: 'blur(12px)' },
  headerInner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 66, maxWidth: 1440, margin: '0 auto' },
  logo: { fontSize: '1.65rem', fontWeight: 900, letterSpacing: '-1px', textDecoration: 'none', color: '#f1f5f9' },
  navLinks: { display: 'flex', gap: 32 },
  navA: { color: '#94a3b8', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color .15s' },
  btnGhost: { background: 'transparent', color: '#94a3b8', border: '1px solid #1e293b', padding: '8px 18px', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  btnRed: { background: '#dc2626', color: '#fff', border: 'none', padding: '9px 22px', borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: 'pointer' },

  // ticker
  ticker: { background: '#080f20', borderBottom: '1px solid #0f172a', overflow: 'hidden', padding: '8px 0' },
  tickerTrack: { display: 'inline-flex', gap: 52, animation: 'ticker 38s linear infinite', whiteSpace: 'nowrap' },
  tickerChip: { display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 13 },

  // hero
  hero: { padding: '90px 48px 70px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg,#060d1f 0%,#080f22 100%)' },
  heroGlow: { position: 'absolute', top: -100, left: '40%', transform: 'translateX(-50%)', width: 700, height: 700, background: 'radial-gradient(circle, rgba(220,38,38,.12) 0%, transparent 65%)', pointerEvents: 'none' },
  heroContent: { maxWidth: 680, position: 'relative' },
  heroBadge: { display: 'inline-block', background: 'rgba(220,38,38,.15)', color: '#fca5a5', border: '1px solid rgba(220,38,38,.3)', borderRadius: 20, padding: '5px 16px', fontSize: 12, fontWeight: 600, marginBottom: 20 },
  heroH1: { fontSize: '2.9rem', fontWeight: 900, lineHeight: 1.2, marginBottom: 18, letterSpacing: '-1px' },
  heroRed: { color: '#ef4444' },
  heroSub: { color: '#64748b', fontSize: 15, lineHeight: 1.8, marginBottom: 32 },
  heroBtnPrimary: { background: 'linear-gradient(135deg,#dc2626,#991b1b)', color: '#fff', border: 'none', padding: '13px 32px', borderRadius: 9, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(220,38,38,.4)' },
  heroBtnSec: { background: 'transparent', color: '#e2e8f0', border: '1px solid #1e293b', padding: '13px 28px', borderRadius: 9, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  btcBanner: { display: 'inline-flex', alignItems: 'center', gap: 14, background: '#0d1626', border: '1px solid #1e293b', borderRadius: 12, padding: '12px 20px', marginTop: 32 },
  liveDot: { width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', display: 'inline-block', animation: 'pulse 1.5s infinite' },

  // stats
  statsBar: { display: 'flex', justifyContent: 'center', gap: 0, background: '#080f20', borderTop: '1px solid #0f172a', borderBottom: '1px solid #0f172a', flexWrap: 'wrap' },
  statItem: { flex: '1 1 180px', padding: '28px 20px', textAlign: 'center', borderRight: '1px solid #0f172a' },
  statVal: { fontSize: '2rem', fontWeight: 900, color: '#f1f5f9', marginBottom: 4 },
  statLbl: { color: '#475569', fontSize: 13 },

  // layout
  mainWrap: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, padding: '36px 48px 60px', maxWidth: 1440, margin: '0 auto' },
  colCenter: { minWidth: 0 },
  sidebar: { minWidth: 0 },

  // card
  card: { background: '#0a1628', border: '1px solid #0f172a', borderRadius: 14, padding: 22, marginBottom: 20 },
  secTitle: { display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 15, marginBottom: 16 },
  dot: { width: 8, height: 8, borderRadius: '50%', display: 'inline-block', flexShrink: 0 },

  // icons
  iconLg: { width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, flexShrink: 0 },
  iconSm: { width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, flexShrink: 0 },

  // table
  th: { textAlign: 'left', fontSize: 11, color: '#475569', padding: '0 8px 12px', textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap' },
  tr: { borderTop: '1px solid #0f172a', transition: 'background .12s' },
  td: { padding: '13px 8px', fontSize: 14 },

  // sidebar rows
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0' },
  newsItem: { padding: '12px 0', cursor: 'pointer' },
  tag: { fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4 },

  // promo
  promoBanner: { background: 'linear-gradient(135deg,#1a0a0a,#0d1a2e)', border: '1px solid #3d1515', borderRadius: 14, padding: 22 },

  // why section
  whySection: { padding: '70px 48px', maxWidth: 1440, margin: '0 auto', background: '#060d1f' },
  whyTitle: { textAlign: 'center', fontSize: 28, fontWeight: 900, marginBottom: 40 },
  whyGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 },
  featureCard: { background: '#0a1628', border: '1px solid #0f172a', borderRadius: 14, padding: 24 },
  featureIcon: { fontSize: 28, marginBottom: 14 },

  // cta
  cta: { textAlign: 'center', padding: '80px 48px', background: 'linear-gradient(135deg,#0d0505,#060d1f)' },

  // footer
  footer: { background: '#04080f', borderTop: '1px solid #0f172a' },
  footerTop: { display: 'flex', gap: 60, padding: '48px 48px 32px', maxWidth: 1440, margin: '0 auto', flexWrap: 'wrap' },
  footerBot: { display: 'flex', justifyContent: 'space-between', padding: '20px 48px', borderTop: '1px solid #0f172a', fontSize: 12, color: '#334155', flexWrap: 'wrap', gap: 8, maxWidth: 1440, margin: '0 auto' },
}

const GLOBAL_CSS = `
  @keyframes ticker   { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  @keyframes pulse    { 0%,100% { opacity:1; } 50% { opacity:.4; } }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #060d1f !important; }
  #root { width: 100% !important; max-width: 100% !important; border: none !important; text-align: left !important; min-height: unset !important; display: block !important; }
  a:hover { color: #f1f5f9 !important; }
  tr:hover td { background: rgba(255,255,255,.02); }
  @media (max-width: 1100px) {
    [style*="gridTemplateColumns: 1fr 360px"] { grid-template-columns: 1fr !important; }
    [style*="gridTemplateColumns: repeat(3, 1fr)"] { grid-template-columns: repeat(2,1fr) !important; }
    [style*="padding: 0 48px"] { padding: 0 20px !important; }
    [style*="padding: 36px 48px"] { padding: 24px 20px !important; }
    [style*="font-size: 2.9rem"] { font-size: 2rem !important; }
  }
  @media (max-width: 600px) {
    [style*="gridTemplateColumns: repeat(2,1fr)"] { grid-template-columns: 1fr !important; }
    [style*="display: flex"][style*="gap: 32"] { gap: 0 !important; display: none !important; }
  }
`
