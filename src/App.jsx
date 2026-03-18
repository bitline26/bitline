import { useState, useEffect } from 'react'
import logoSvg from './assets/logo.svg'
import quantChart from './assets/quant_chart.jpg'
import withdrawalHistory from './assets/withdrawal_history.jpg'
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
//  PNL 라인 차트
// ─────────────────────────────────────────────────────
const PNL_TABS = ['1D', '7D', '30D']

// 2월16일 ~ 3월15일 28개 데이터 (이미지 참조)
const PNL_RAW = [
  { d: '2/16', v: 9200 }, { d: '2/17', v: 8800 }, { d: '2/18', v: 8400 },
  { d: '2/19', v: 8100 }, { d: '2/20', v: 7600 }, { d: '2/21', v: 8300 },
  { d: '2/22', v: 9100 }, { d: '2/23', v: 9800 }, { d: '2/24', v: 9300 },
  { d: '2/25', v: 8700 }, { d: '2/26', v: 9500 }, { d: '2/27', v: 10200 },
  { d: '2/28', v: 9600 }, { d: '3/01', v: 7200 }, { d: '3/02', v: 6800 },
  { d: '3/03', v: 814  }, { d: '3/04', v: 5400 }, { d: '3/05', v: 8900 },
  { d: '3/06', v: 11200}, { d: '3/07', v: 14500}, { d: '3/08', v: 18000},
  { d: '3/09', v: 21000}, { d: '3/10', v: 25000}, { d: '3/11', v: 28500},
  { d: '3/12', v: 31000}, { d: '3/13', v: 34200}, { d: '3/14', v: 36931},
  { d: '3/15', v: 12000},
]

function PNLChart() {
  const [tab, setTab] = useState(2) // 기본 30D

  const slices = { 0: PNL_RAW.slice(-1), 1: PNL_RAW.slice(-7), 2: PNL_RAW }
  const data = slices[tab]
  const maxV = Math.max(...data.map(d => d.v))
  const minV = Math.min(...data.map(d => d.v))
  const maxItem = data.find(d => d.v === maxV)
  const minItem = data.find(d => d.v === minV)

  const fmtUSD = (v) => '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div style={S.card}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={S.secTitle}><span style={{ ...S.dot, background: '#ef4444' }} />코인 PNL 그래프</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {PNL_TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              padding: '4px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700,
              cursor: 'pointer', border: '1px solid',
              background: tab === i ? '#1e293b' : 'transparent',
              color: tab === i ? '#f1f5f9' : '#475569',
              borderColor: tab === i ? '#334155' : 'transparent',
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* 고저점 표시 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 20, marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 700 }}>
          ▲ {fmtUSD(maxV)} <span style={{ color: '#475569', fontWeight: 400 }}>({maxItem?.d})</span>
        </span>
        <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 700 }}>
          ▼ {fmtUSD(minV)} <span style={{ color: '#475569', fontWeight: 400 }}>({minItem?.d})</span>
        </span>
      </div>

      {/* 차트 */}
      <div style={{ height: 220, minWidth: 0, overflow: 'hidden' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="d" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false}
              tickFormatter={v => '$' + (v >= 1000 ? (v/1000).toFixed(0)+'K' : v)}
              width={52}
            />
            <Tooltip
              formatter={v => [fmtUSD(v), 'PNL']}
              contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
              labelStyle={{ color: '#94a3b8', fontSize: 11 }}
              itemStyle={{ color: '#ef4444', fontWeight: 700 }}
            />
            <Area
              type="monotone" dataKey="v"
              stroke="#ef4444" strokeWidth={2.5}
              fill="url(#pnlGrad)"
              dot={false}
              activeDot={{ r: 5, fill: '#ef4444', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
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
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/favicon.svg" alt="비트라인 아이콘" style={{ height: 34 }} />
            <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
              비트<span style={{ color: '#ef4444' }}>라인</span>
            </span>
          </a>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button style={S.btnRed}>신청하기</button>
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
        <div style={{ ...S.heroContent, textAlign: 'center', margin: '0 auto' }}>
          <div style={{ ...S.heroBadge, margin: '0 auto 20px' }}>🔥 실시간 코인 수익률 분석 서비스</div>
          <h1 style={{ ...S.heroH1, textAlign: 'center' }}>
            코인 시장의 모든 정보,<br />
            <span style={S.heroRed}>비트라인</span>에서 한눈에
          </h1>
          <p style={{ ...S.heroSub, textAlign: 'center' }}>
            실시간 시세 · 수익률 분석 · 최신 뉴스 · AI 동향 리포트<br />
            전문 트레이더가 선택하는 암호화폐 정보 플랫폼
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={S.heroBtnPrimary}>지금 무료로 시작하기</button>
          </div>

          {/* 실시간 BTC 배너 */}
          <div style={{ ...S.btcBanner, margin: '32px auto 0' }}>
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


      {/* ──── DB 수집 폼 ──── */}
      <div id="apply-form"><DBForm /></div>

      {/* ──── 프로모 배너 ──── */}
      <PromoBanner />

      {/* ──── 메인 3단 ──── */}
      <div style={S.mainWrap}>

        {/* 중앙: 차트 */}
        <div style={S.colCenter}>

          {/* PNL 라인 차트 */}
          <PNLChart />

          {/* 퀀트 트레이딩 차트 */}
          <div style={S.card}>
            <div style={S.secTitle}>
              <span style={{ ...S.dot, background: '#3b82f6' }} />전문가 퀀트 트레이딩 포지션 지표
            </div>
            <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #1e293b' }}>
              <img
                src={quantChart}
                alt="전문가 퀀트 트레이딩 포지션 지표"
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          </div>
        </div>

        {/* 우측: 사이드바 */}
        <aside style={S.sidebar}>

          {/* 전문가 출금 이력 */}
          <div style={S.card}>
            <div style={S.secTitle}>
              <span style={{ ...S.dot, background: '#22c55e' }} />전문가의 1월 ~ 3월 출금 이력
            </div>
            <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #1e293b' }}>
              <img
                src={withdrawalHistory}
                alt="전문가의 1월 ~ 3월 출금 이력"
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          </div>

          {/* 프로모 배너 */}
          <div style={S.promoBanner}>
            <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 10 }}>🎁 비트라인 혜택</div>
            <div style={{ fontWeight: 800, fontSize: 19, lineHeight: 1.5, marginBottom: 16 }}>
              전문가 투자 노하우<br />3일 무료 제공
            </div>
            <button
              style={{ ...S.btnRed, width: '100%', padding: '12px 0', fontSize: 15, borderRadius: 9 }}
              onClick={() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })}
            >신청하기</button>
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
          1만 회원이 선택한 코인 정보 플랫폼 — 비트라인
        </p>
        <button style={{ ...S.heroBtnPrimary, fontSize: 16, padding: '14px 48px' }}>
          무료로 시작하기
        </button>
      </section>

      {/* ──── FOOTER ──── */}
      <footer style={{ background: 'rgba(6,13,31,0.97)', borderTop: '1px solid #0f172a' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 48px', height: 66, maxWidth: 1440, margin: '0 auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/favicon.svg" alt="비트라인 아이콘" style={{ height: 30 }} />
            <span style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
              비트<span style={{ color: '#ef4444' }}>라인</span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 28 }}>
            {['실시간 시세', '수익률 분석', '코인 차트', '뉴스', '이용약관', '개인정보처리방침'].map(m => (
              <a key={m} href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: 13 }}>{m}</a>
            ))}
          </div>
          <span style={{ color: '#334155', fontSize: 12 }}>© 2026 비트라인. 투자에는 위험이 따릅니다.</span>
        </div>
      </footer>

      <style>{GLOBAL_CSS}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────
//  뱃지
// ─────────────────────────────────────────────────────
//  프로모 배너
// ─────────────────────────────────────────────────────
function PromoBanner() {
  return (
    <div style={{ padding: '0 48px 36px', maxWidth: 1440, margin: '0 auto' }}>
      <div style={{
        position: 'relative', overflow: 'hidden', borderRadius: 20,
        background: 'linear-gradient(135deg, #0a1a6e 0%, #1a3aad 40%, #0d6efd 70%, #0891b2 100%)',
        padding: '52px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        minHeight: 280,
      }}>

        {/* 배경 캔들차트 장식 (SVG) */}
        <svg style={{ position: 'absolute', right: 0, bottom: 0, opacity: 0.12 }} width="500" height="280" viewBox="0 0 500 280">
          {[40,90,150,210,270,330,390,450].map((x, i) => {
            const heights = [80,120,60,150,90,130,70,110]
            const tops = [100,60,140,50,110,70,130,90]
            return (
              <g key={i}>
                <line x1={x} y1={tops[i] - 20} x2={x} y2={tops[i] + heights[i] + 20} stroke="white" strokeWidth="2"/>
                <rect x={x - 10} y={tops[i]} width="20" height={heights[i]} rx="2" fill="white"/>
              </g>
            )
          })}
        </svg>

        {/* 배경 격자선 */}
        <svg style={{ position: 'absolute', inset: 0, opacity: 0.06 }} width="100%" height="100%">
          {[0,1,2,3,4].map(i => (
            <line key={i} x1="0" y1={i * 70} x2="100%" y2={i * 70} stroke="white" strokeWidth="1"/>
          ))}
        </svg>

        {/* 왼쪽 텍스트 */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: '#93c5fd',
            marginBottom: 12, letterSpacing: 2, textTransform: 'uppercase',
          }}>🔥 BITLINE SPECIAL</div>

          <div style={{
            fontSize: 48, fontWeight: 900, lineHeight: 1.15,
            color: 'white', marginBottom: 8,
            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
          }}>
            가자!<br />
            <span style={{
              background: 'linear-gradient(90deg, #ffffff, #93c5fd)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>코인 10만 달러!!</span>
          </div>

          <div style={{
            fontSize: 22, fontWeight: 800, color: '#fbbf24',
            marginBottom: 20, textShadow: '0 0 20px rgba(251,191,36,0.5)',
          }}>
            지금이 수익의 기회!!
          </div>

          <div style={{ fontSize: 15, color: '#bfdbfe', lineHeight: 1.8, marginBottom: 30 }}>
            비트라인 전문가의 급등 예상 코인 정보!!<br />
            <strong style={{ color: 'white' }}>무료 체험으로 확인해 보세요!!</strong>
          </div>

          <button style={{
            background: 'linear-gradient(135deg, #dc2626, #be123c)',
            color: 'white', border: 'none', padding: '14px 36px',
            borderRadius: 10, fontSize: 16, fontWeight: 900, cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(220,38,38,.5)',
            letterSpacing: '-0.3px',
          }}>
            급등 코인 무료로 받기 →
          </button>
        </div>

        {/* 오른쪽 상승 화살표 SVG */}
        <div style={{ position: 'relative', zIndex: 2, flexShrink: 0 }}>
          <svg width="300" height="240" viewBox="0 0 300 240" fill="none">
            {/* 글로우 라인 */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <polyline points="20,200 70,160 110,175 160,120 200,140 260,60"
              stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              opacity="0.5" filter="url(#glow)"/>

            {/* 굵은 상승 화살표 */}
            <polyline points="30,210 90,170 130,188 185,128 230,150 280,55"
              stroke="url(#arrowGrad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>

            {/* 화살촉 */}
            <polygon points="280,55 255,50 268,75" fill="#ec4899"/>

            {/* 데이터 포인트 원 */}
            {[[90,170],[130,188],[185,128],[230,150]].map(([x,y],i) => (
              <circle key={i} cx={x} cy={y} r="5" fill="white" opacity="0.8"/>
            ))}
            <circle cx="280" cy="55" r="8" fill="#ec4899"/>

            <defs>
              <linearGradient id="arrowGrad" x1="30" y1="210" x2="280" y2="55" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#60a5fa"/>
                <stop offset="60%" stopColor="#a855f7"/>
                <stop offset="100%" stopColor="#ec4899"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────
//  DB 수집 폼
// ─────────────────────────────────────────────────────
function DBForm() {
  const [form, setForm] = useState({ name: '', phone: '', agreePrivacy: false, agreeMarketing: false })
  const [done, setDone] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) { alert('성함과 연락처를 입력해주세요.'); return }
    if (!form.agreePrivacy) { alert('개인정보 수집·이용에 동의해주세요.'); return }
    setDone(true)
  }

  if (done) return (
    <div style={FS.wrap}>
      <div style={FS.card}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <div style={{ fontWeight: 900, fontSize: 20 }}>신청 완료!</div>
          <div style={{ color: '#94a3b8', fontSize: 14, marginTop: 8 }}>입력하신 연락처로 곧 안내드리겠습니다.</div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={FS.wrap}>
      <div style={FS.card}>
        <div style={FS.title}>
          비트라인 전문가 <span style={{ color: '#ef4444' }}>VIP 시점·정보</span> 5일간 무료 공개 <span style={{ color: '#fbbf24' }}>100명 선착순</span>
        </div>

        <form onSubmit={submit} style={FS.form}>
          <input style={FS.input} placeholder="이름" value={form.name}
            onChange={e => set('name', e.target.value)} />
          <input style={FS.input} placeholder="연락처  010-0000-0000" value={form.phone}
            onChange={e => set('phone', e.target.value)} />
          <button type="submit" style={FS.btn}>급등 코인 정보 무료받기</button>
        </form>

        <div style={FS.checks}>
          <label style={FS.chkLabel}>
            <input type="checkbox" checked={form.agreePrivacy} style={FS.chk}
              onChange={e => set('agreePrivacy', e.target.checked)} />
            개인정보 수집·이용 동의 <span style={{ color: '#ef4444' }}>(필수)</span>
          </label>
          <label style={FS.chkLabel}>
            <input type="checkbox" checked={form.agreeMarketing} style={FS.chk}
              onChange={e => set('agreeMarketing', e.target.checked)} />
            마케팅 정보 수신 동의 <span style={{ color: '#ef4444' }}>(필수)</span>
          </label>
        </div>
      </div>
    </div>
  )
}

const FS = {
  wrap: { padding: '0 48px 36px', maxWidth: 1440, margin: '0 auto' },
  card: {
    background: '#0d1a2e',
    border: '1.5px solid #1e3a5f',
    borderRadius: 18,
    padding: '32px 40px',
    boxShadow: '0 0 40px rgba(59,130,246,.07)',
  },
  title: {
    fontSize: 22, fontWeight: 900, textAlign: 'center',
    marginBottom: 24, lineHeight: 1.4,
  },
  form: {
    display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap',
    marginBottom: 16,
  },
  input: {
    background: '#060d1f', border: '1px solid #1e293b', borderRadius: 8,
    padding: '13px 18px', color: '#e2e8f0', fontSize: 15, outline: 'none',
    width: 210, flexShrink: 0,
  },
  btn: {
    background: 'linear-gradient(135deg,#dc2626,#991b1b)',
    color: '#fff', border: 'none', padding: '13px 28px',
    borderRadius: 8, fontSize: 15, fontWeight: 800, cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(220,38,38,.4)', whiteSpace: 'nowrap',
  },
  checks: { display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' },
  chkLabel: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94a3b8', cursor: 'pointer' },
  chk: { accentColor: '#ef4444', cursor: 'pointer', width: 15, height: 15 },
}

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
  hero: { padding: '90px 48px 70px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg,#060d1f 0%,#080f22 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  heroGlow: { position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, background: 'radial-gradient(circle, rgba(220,38,38,.12) 0%, transparent 65%)', pointerEvents: 'none' },
  heroContent: { maxWidth: 720, position: 'relative', width: '100%' },
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
