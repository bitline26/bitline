import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const GLOBAL_CSS = `
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #060d1f !important; }
  html { scroll-behavior: smooth; }
  input { -webkit-appearance: none; }
  input:focus { outline: none; border-color: #dc2626 !important; }
  button:active { transform: scale(.98); }
  ::placeholder { color: #475569; }
`

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw8lBInlXfIfyGLajUkwB6DmMufRijcSpB8UgqFVO5ojowwWX0-jjz2P1rZBu_65UT5yw/exec'

// BTC 2026년 실제 흐름 기반 차트 데이터
const BTC_DATA = [
  { t: '1월초', p: 94000 },
  { t: '1월말', p: 102000 },
  { t: '2월초', p: 96000 },
  { t: '2월말', p: 84000 },
  { t: '3월초', p: 78000 },
  { t: '3월말', p: 82000 },
  { t: '4월', p: 87000 },
]

const SIGNALS = [
  { label: 'BTC 롱 진입', date: '2026.01.08', entry: '$94,200', result: '+62%', color: '#22c55e', coin: '₿' },
  { label: 'BTC 숏 진입', date: '2026.02.03', entry: '$101,800', result: '+44%', color: '#22c55e', coin: '₿' },
  { label: 'ETH 롱 진입', date: '2026.02.18', entry: '$2,840', result: '+38%', color: '#22c55e', coin: 'Ξ' },
  { label: 'BTC 숏 진입', date: '2026.03.05', entry: '$93,400', result: '+51%', color: '#22c55e', coin: '₿' },
]

const REVIEWS = [
  { name: '김*준', job: '직장인', text: '반신반의했는데 3주만에 수익났어요. 시그널 적중률 진짜 높습니다. 처음엔 믿기 어려웠는데 실제로 돈이 들어오니 증명되더라고요.', profit: '+187%' },
  { name: '이*영', job: '자영업자', text: '혼자 매매하다 손실만 봤는데 비트라인 받고 나서 완전 달라졌어요. 진입 타이밍이 정확해서 이제 차트 안봐도 됩니다.', profit: '+243%' },
  { name: '박*수', job: '투자자', text: '비트코인 44% 폭락 때 미리 빠져나왔습니다. 신기할 정도로 정확해요. 주변에 다 추천하고 있어요.', profit: '손실방어' },
  { name: '최*희', job: '주부', text: '처음 코인선물 시작했는데 매일 아침 시그널 받으니까 진짜 편해요. 전문가가 옆에 있는 느낌이에요.', profit: '+92%' },
  { name: '정*호', job: '프리랜서', text: '3개월 동안 꾸준히 수익이 쌓였어요. 손실 방어도 완벽하고 진입/청산 타이밍이 너무 정확해서 놀랐습니다.', profit: '+315%' },
  { name: '강*민', job: '회사원', text: '처음엔 무료라서 의심했는데 상담 받고 나서 바로 납득됐어요. 전문가 수준의 분석을 내가 직접 받는 느낌.', profit: '+128%' },
]

const STRENGTHS = [
  { icon: '📡', title: '매일 아침 시그널 발송', desc: '장이 열리기 전 전문가 분석 기반 진입가·청산가·손절가 3가지 제공. 차트 안 봐도 됩니다.' },
  { icon: '🎯', title: '적중률 최대 89%', desc: '3개월 연속 검증된 수치. 감이 아닌 데이터 기반 알고리즘 + 전문가 검수의 결합.' },
  { icon: '🛡️', title: '손실 방어 우선', desc: '수익보다 손실 방어를 먼저 봅니다. 손절 라인 명확히 제시해 계좌 보호를 최우선으로.' },
  { icon: '👤', title: '1:1 전담 전문가', desc: '담당 전문가가 배정되어 개인 투자 성향에 맞는 맞춤 상담 제공. 카카오톡 실시간 소통.' },
  { icon: '💎', title: '완전 무료 제공', desc: '가입비, 월정액 없음. 상담부터 시그널 체험까지 완전 무료로 제공합니다.' },
  { icon: '⚡', title: '즉시 시그널 수신', desc: '신청 후 24시간 이내 전문가 연락. 다음날 아침부터 바로 시그널을 받아볼 수 있습니다.' },
]

const HOW_IT_WORKS = [
  { step: '01', title: '무료 상담 신청', desc: '이름과 연락처만 입력하면 끝. 30초면 완료됩니다.' },
  { step: '02', title: '전문가 1:1 상담', desc: '24시간 이내 담당 전문가가 직접 연락드립니다. 투자 성향 파악 후 전략 맞춤 설정.' },
  { step: '03', title: '매일 시그널 수신', desc: '매일 아침 카카오톡으로 시그널 발송. 진입·청산·손절 가격 3가지를 명확히 제시.' },
]

const COMPARE = [
  { item: '진입 타이밍', alone: '감으로 추측', bitline: '전문가 알고리즘 분석' },
  { item: '손실 대응', alone: '멘탈 나가서 늦은 손절', bitline: '사전 손절가 설정 완료' },
  { item: '시장 모니터링', alone: '24시간 차트 감시', bitline: '전문가가 대신 모니터링' },
  { item: '심리 관리', alone: '공포·탐욕에 휘둘림', bitline: '냉정한 데이터 기반 판단' },
  { item: '수익 일관성', alone: '들쭉날쭉', bitline: '3개월 연속 양호한 수익률' },
  { item: '비용', alone: '손실만 쌓임', bitline: '완전 무료' },
]

const COINS = [
  { sym: 'BTC', name: '비트코인', change: '+62%', color: '#f7931a' },
  { sym: 'ETH', name: '이더리움', change: '+38%', color: '#627eea' },
  { sym: 'SOL', name: '솔라나', change: '+91%', color: '#9945ff' },
  { sym: 'XRP', name: '리플', change: '+44%', color: '#00aae4' },
  { sym: 'BNB', name: '바이낸스코인', change: '+29%', color: '#f3ba2f' },
  { sym: 'DOGE', name: '도지코인', change: '+78%', color: '#c2a633' },
]

const FAQS = [
  { q: '비용이 정말 무료인가요?', a: '네, 상담부터 시그널 체험까지 완전 무료입니다. 숨겨진 비용이나 추후 요금 청구 없습니다.' },
  { q: '코인 투자 경험이 없어도 괜찮나요?', a: '처음이셔도 전혀 문제없습니다. 전문가가 기초부터 안내해드리며 시그널은 진입가·청산가·손절가로 명확히 제시됩니다.' },
  { q: '시그널은 어떤 방식으로 받나요?', a: '카카오톡 1:1 채널로 매일 아침 발송됩니다. 별도 앱 설치 없이 카카오톡만 있으면 됩니다.' },
  { q: '손실이 날 수도 있나요?', a: '적중률 89%이지만 100%는 아닙니다. 손절 라인을 명확히 제시하여 손실을 최소화합니다. 암호화폐 투자는 원금 손실 가능성이 있습니다.' },
  { q: '몇 퍼센트 수익을 기대할 수 있나요?', a: '개인 투자금과 레버리지 설정에 따라 다릅니다. 3개월 누적 기준 회원 평균 수익률은 양호한 편이나 과거 수익이 미래를 보장하지 않습니다.' },
]

function FormCard({ form, setForm, handlePhone, handleSubmit, error, loading, spotsLeft }) {
  return (
    <div style={S.formBox}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 19, fontWeight: 900, color: '#f1f5f9', marginBottom: 6 }}>전문가 1:1 무료 상담</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, color: '#ef4444', fontWeight: 700 }}>
          <span style={S.liveDot} />
          잔여 {spotsLeft}석 · 선착순 마감
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input style={S.formInput} placeholder="이름" value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <input style={S.formInput} placeholder="010-0000-0000" value={form.phone}
          onChange={handlePhone} inputMode="numeric" />
        <label style={S.checkLabel}>
          <input type="checkbox" style={S.check}
            checked={form.agreePrivacy}
            onChange={e => setForm(f => ({ ...f, agreePrivacy: e.target.checked }))} />
          [필수] 개인정보 수집 및 이용에 동의합니다
        </label>
        {error && <div style={S.errBox}>{error}</div>}
        <button type="submit" style={S.submitBtn} disabled={loading}>
          {loading ? '신청 중...' : '무료 상담 신청하기'}
        </button>
        <p style={S.formNote}>24시간 이내 전문가가 연락드립니다</p>
      </form>
    </div>
  )
}

export default function Lead() {
  const [form, setForm] = useState({ name: '', phone: '', agreePrivacy: false })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [spotsLeft, setSpotsLeft] = useState(7)
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

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

    const list = JSON.parse(localStorage.getItem('bitline_submissions') || '[]')
    list.push({ id: Date.now(), name: form.name.trim(), phone: form.phone, agreePrivacy: true, createdAt: new Date().toISOString(), source: 'lead' })
    localStorage.setItem('bitline_submissions', JSON.stringify(list))

    try {
      const params = new URLSearchParams({ full_name: form.name.trim(), phone_number: form.phone, experience: '', amount: '', created_time: new Date().toISOString() })
      await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, { mode: 'no-cors' })
    } catch (_) {}

    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) return <SuccessPage name={form.name} />

  const formProps = { form, setForm, handlePhone, handleSubmit, error, loading, spotsLeft }

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
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={S.headerBadge}>📊 적중률 89%</div>
            <div style={{ ...S.headerBadge, color: '#86efac', background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)' }}>✅ 무료</div>
          </div>
        </div>
      </header>

      {/* ══ 히어로 + 폼 ══ */}
      <section style={S.hero}>
        <div style={S.heroInner}>
          <div style={S.heroLeft}>
            <div style={S.eyebrow}>🔥 2026년 변동장 대응 전략</div>
            <h1 style={S.h1}>
              하락장에서도<br />
              <span style={S.red}>수익 내는 법</span>
            </h1>
            <p style={S.heroDesc}>
              감으로 하는 코인 투자, 이제 그만.<br />
              <strong style={{ color: '#f1f5f9' }}>비트라인 전문가 시그널</strong>로<br />
              진입·청산·손절 타이밍을 정확히 잡으세요.
            </p>
            <div style={S.trustRow}>
              {['✅ 가입비 0원', '✅ 1:1 전담 전문가', '✅ 즉시 시그널 제공', '✅ 손실 방어 우선'].map((t, i) => (
                <span key={i} style={S.trustBadge}>{t}</span>
              ))}
            </div>
          </div>
          <FormCard {...formProps} />
        </div>
      </section>

      {/* 수치 바 */}
      <div style={S.statsBar}>
        {[
          { val: '89%', label: '시그널 적중률', color: '#ef4444' },
          { val: '3개월+', label: '연속 수익', color: '#22c55e' },
          { val: '2,800+', label: '누적 회원', color: '#3b82f6' },
          { val: '0원', label: '이용 비용', color: '#fbbf24' },
        ].map((s, i) => (
          <div key={i} style={S.statItem}>
            <div style={{ ...S.statVal, color: s.color }}>{s.val}</div>
            <div style={S.statLbl}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ══ 2026 차트 + 시그널 실적 ══ */}
      <section style={{ padding: '60px 20px', background: '#080f20' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={S.secEyebrow}>2026년 실제 시그널 수익</div>
          <h2 style={S.secTitle}>BTC 변동장에서<br /><span style={{ color: '#22c55e' }}>비트라인은 이렇게 벌었습니다</span></h2>

          {/* BTC 차트 */}
          <div style={{ background: '#060d1f', border: '1px solid #0f172a', borderRadius: 16, padding: '20px 8px 12px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px 16px' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#f1f5f9' }}>BTC/USDT · 2026</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>비트라인 시그널 적용 기준</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900, fontSize: 20, color: '#22c55e' }}>+195%</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>누적 수익률 (2026 YTD)</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={BTC_DATA} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="btcGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ background: '#0a1628', border: '1px solid #1e293b', borderRadius: 8, fontSize: 13 }}
                  formatter={v => [`$${v.toLocaleString()}`, 'BTC']}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="p" stroke="#22c55e" strokeWidth={2.5} fill="url(#btcGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 시그널 실적 4개 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
            {SIGNALS.map((s, i) => (
              <div key={i} style={{ background: '#060d1f', border: '1px solid #0f172a', borderRadius: 12, padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ background: 'rgba(34,197,94,.15)', color: '#22c55e', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>적중</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>{s.label}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{s.date} · 진입 {s.entry}</div>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.result}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: '#334155' }}>
            * 과거 수익률이 미래 수익을 보장하지 않습니다
          </div>
        </div>
      </section>

      {/* ══ 비트라인 강점 6가지 ══ */}
      <section style={S.sec}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={S.secEyebrow}>왜 비트라인인가</div>
          <h2 style={S.secTitle}>수천 명이 선택한<br /><span style={{ color: '#ef4444' }}>6가지 이유</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {STRENGTHS.map((s, i) => (
              <div key={i} style={{ background: '#0a1628', border: '1px solid #0f172a', borderRadius: 16, padding: '24px 20px', transition: 'border-color .2s' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{s.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 이용 방법 3단계 ══ */}
      <section style={{ padding: '60px 20px', background: '#080f20' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={S.secEyebrow}>시작이 어렵지 않습니다</div>
          <h2 style={S.secTitle}>3단계로 끝나는<br /><span style={{ color: '#22c55e' }}>무료 시그널 수령</span></h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {HOW_IT_WORKS.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', paddingBottom: i < HOW_IT_WORKS.length - 1 ? 0 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#dc2626,#b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#fff', flexShrink: 0 }}>{h.step}</div>
                  {i < HOW_IT_WORKS.length - 1 && <div style={{ width: 2, height: 40, background: '#1e293b', margin: '8px 0' }} />}
                </div>
                <div style={{ paddingTop: 12, paddingBottom: i < HOW_IT_WORKS.length - 1 ? 0 : 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>{h.title}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, paddingBottom: 28 }}>{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 혼자 vs 비트라인 비교표 ══ */}
      <section style={S.sec}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={S.secEyebrow}>지금 당신의 상황</div>
          <h2 style={S.secTitle}>혼자 할 때 vs<br /><span style={{ color: '#22c55e' }}>비트라인과 함께</span></h2>
          <div style={{ background: '#0a1628', border: '1px solid #0f172a', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#060d1f', borderBottom: '1px solid #0f172a' }}>
              <div style={{ padding: '14px 16px', fontSize: 12, color: '#475569', fontWeight: 700 }}>항목</div>
              <div style={{ padding: '14px 16px', fontSize: 12, color: '#ef4444', fontWeight: 700, textAlign: 'center' }}>혼자 투자</div>
              <div style={{ padding: '14px 16px', fontSize: 12, color: '#22c55e', fontWeight: 700, textAlign: 'center' }}>비트라인</div>
            </div>
            {COMPARE.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: i < COMPARE.length - 1 ? '1px solid #0f172a' : 'none', background: i % 2 === 0 ? '#0a1628' : '#060d1f' }}>
                <div style={{ padding: '14px 16px', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>{row.item}</div>
                <div style={{ padding: '14px 16px', fontSize: 12, color: '#ef4444', textAlign: 'center', lineHeight: 1.5 }}>{row.alone}</div>
                <div style={{ padding: '14px 16px', fontSize: 12, color: '#22c55e', textAlign: 'center', fontWeight: 700, lineHeight: 1.5 }}>{row.bitline}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 커버 코인 ══ */}
      <section style={{ padding: '60px 20px', background: '#080f20' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={S.secEyebrow}>시그널 제공 종목</div>
          <h2 style={S.secTitle}>6개 주요 코인<br /><span style={{ color: '#fbbf24' }}>전문가 시그널 제공</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {COINS.map((c, i) => (
              <div key={i} style={{ background: '#060d1f', border: '1px solid #0f172a', borderRadius: 14, padding: '18px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#f1f5f9' }}>{c.sym}</div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{c.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#22c55e' }}>{c.change}</div>
                  <div style={{ fontSize: 10, color: '#334155', marginTop: 2 }}>2026 YTD</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 문제 공감 ══ */}
      <section style={S.sec}>
        <div style={S.secInner}>
          <div style={S.secEyebrow}>이런 경험 있으신가요?</div>
          <h2 style={S.secTitle}>코인선물<br />혼자 하면 이렇게 됩니다</h2>
          <div style={S.painGrid}>
            {[
              { icon: '📉', title: '진입 즉시 역방향', text: '들어가자마자 반대로 가는 가격. 타이밍이 문제입니다.' },
              { icon: '😰', title: '뉴스 보고 물림', text: '이미 올랐을 때 뉴스 뜨고, 그때 들어가면 항상 고점.' },
              { icon: '🌙', title: '밤새 차트 감시', text: '잠도 못 자고 폰만 들여다보는 삶. 이게 투자가 맞나요?' },
              { icon: '❌', title: '수익이 손실로', text: '수익 났는데 청산 타이밍 놓쳐 다시 손실로 마감.' },
              { icon: '💸', title: '레버리지 청산', text: '강제 청산 당하고 계좌 날린 경험. 손절 기준이 없어서.' },
              { icon: '😵', title: '정보 과부하', text: '유튜브, 텔레그램 정보 넘치는데 뭘 믿어야 할지 모름.' },
            ].map((p, i) => (
              <div key={i} style={{ ...S.painCard, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 26 }}>{p.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{p.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 중간 CTA 배너 ══ */}
      <section style={{ padding: '52px 20px', background: 'linear-gradient(135deg,#1a0808,#2d0a0a)', borderTop: '1px solid #3d1515', borderBottom: '1px solid #3d1515' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(1.6rem,5vw,2.4rem)', fontWeight: 900, color: '#f1f5f9', lineHeight: 1.3, marginBottom: 16 }}>
            지금 이 순간에도<br /><span style={{ color: '#ef4444' }}>비트라인 회원은 수익 중입니다</span>
          </div>
          <p style={{ fontSize: 15, color: '#94a3b8', marginBottom: 28, lineHeight: 1.8 }}>
            변동장은 위기가 아닙니다.<br />방향만 알면 수익 기회입니다.
          </p>
          <a href="#bottomForm" style={{ display: 'inline-block', background: '#dc2626', color: '#fff', borderRadius: 14, padding: '18px 40px', fontSize: 18, fontWeight: 900, textDecoration: 'none', boxShadow: '0 4px 24px rgba(220,38,38,.5)' }}>
            무료 상담 신청하기 →
          </a>
        </div>
      </section>

      {/* ══ 후기 ══ */}
      <section style={{ ...S.sec, background: '#080f20' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={S.secEyebrow}>실제 회원 후기</div>
          <h2 style={S.secTitle}>"처음엔 반신반의했는데...<br /><span style={{ color: '#22c55e' }}>이제는 없으면 안 됩니다"</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={S.reviewCard}>
                <div style={S.reviewTop}>
                  <div style={S.avatar}>{r.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{r.job}</div>
                    <div style={{ color: '#fbbf24', fontSize: 12, marginTop: 2 }}>★★★★★</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontWeight: 900, fontSize: 17, color: r.profit.includes('+') ? '#22c55e' : '#fbbf24' }}>{r.profit}</div>
                </div>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.8, marginTop: 12 }}>"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section style={S.sec}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={S.secEyebrow}>자주 묻는 질문</div>
          <h2 style={{ ...S.secTitle, marginBottom: 32 }}>궁금하신 점<br /><span style={{ color: '#fbbf24' }}>바로 확인하세요</span></h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: '#0a1628', border: `1px solid ${openFaq === i ? '#dc2626' : '#0f172a'}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color .2s' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', background: 'none', border: 'none', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{faq.q}</span>
                  <span style={{ color: '#dc2626', fontSize: 20, fontWeight: 300, flexShrink: 0, marginLeft: 12 }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 18px', fontSize: 13, color: '#64748b', lineHeight: 1.8 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 하단 폼 ══ */}
      <section id="bottomForm" style={{ padding: '60px 20px', background: '#080f20' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={S.secEyebrow}>선착순 무료 상담 신청</div>
          <h2 style={{ ...S.secTitle, marginBottom: 28 }}>지금 신청하면<br /><span style={{ color: '#22c55e' }}>즉시 시그널 무료 제공</span></h2>
          <div style={S.formBox2}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, color: '#ef4444', fontWeight: 700, marginBottom: 16 }}>
              <span style={S.liveDot} />
              잔여 {spotsLeft}석 · 선착순 마감
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input style={S.formInput} placeholder="이름" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <input style={S.formInput} placeholder="010-0000-0000" value={form.phone}
                onChange={handlePhone} inputMode="numeric" />
              <label style={S.checkLabel}>
                <input type="checkbox" style={S.check}
                  checked={form.agreePrivacy}
                  onChange={e => setForm(f => ({ ...f, agreePrivacy: e.target.checked }))} />
                [필수] 개인정보 수집 및 이용에 동의합니다
              </label>
              {error && <div style={S.errBox}>{error}</div>}
              <button type="submit" style={S.submitBtn} disabled={loading}>
                {loading ? '신청 중...' : '무료 상담 신청하기'}
              </button>
              <p style={S.formNote}>24시간 이내 전문가가 연락드립니다</p>
            </form>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer style={S.footer}>
        <div style={S.footerInner}>
          <span style={S.footerLogo}>비트라인</span>
          <p style={S.footerTxt}>본 서비스는 투자 참고용 정보를 제공하며, 투자 결과에 대한 책임은 투자자 본인에게 있습니다. 암호화폐 투자는 원금 손실이 발생할 수 있습니다.</p>
          <p style={{ ...S.footerTxt, marginTop: 6 }}>© 2026 비트라인. All rights reserved.</p>
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
        <div style={{ background: '#0a1628', border: '1px solid #1e293b', borderRadius: 12, padding: '18px 20px', fontSize: 13, color: '#64748b', lineHeight: 2.4 }}>
          <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>다음 단계</div>
          1. 전문가 전화 상담<br />
          2. 1:1 카카오톡 채널 연결<br />
          3. 매일 아침 시그널 수신 시작
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

  hero: { padding: '40px 20px 52px', background: 'linear-gradient(180deg,#060d1f,#08111f)' },
  heroInner: { maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' },
  heroLeft: { flex: '1 1 300px', animation: 'fadeUp .6s ease both' },
  eyebrow: { display: 'inline-block', background: 'rgba(220,38,38,.15)', color: '#fca5a5', border: '1px solid rgba(220,38,38,.3)', borderRadius: 20, padding: '5px 14px', fontSize: 13, fontWeight: 700, marginBottom: 16 },
  h1: { fontSize: 'clamp(2rem,6vw,3rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: 16, color: '#f1f5f9', letterSpacing: '-1px' },
  heroDesc: { fontSize: 15, color: '#94a3b8', lineHeight: 1.9, marginBottom: 24 },
  trustRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  trustBadge: { background: 'rgba(255,255,255,.06)', color: '#94a3b8', fontSize: 12, padding: '5px 12px', borderRadius: 20, border: '1px solid #1e293b' },

  formBox: { flex: '1 1 320px', background: '#080f20', border: '3px solid #dc2626', borderRadius: 20, padding: '28px 24px', animation: 'fadeUp .6s .1s ease both', boxShadow: '0 0 40px rgba(220,38,38,.2), 0 12px 40px rgba(0,0,0,.5)' },
  formBox2: { background: '#080f20', border: '3px solid #dc2626', borderRadius: 20, padding: '28px 24px', boxShadow: '0 0 40px rgba(220,38,38,.2)' },
  formInput: { background: '#0d1829', border: '2px solid #1e3a5f', borderRadius: 14, padding: '18px', fontSize: 18, color: '#f1f5f9', width: '100%', transition: 'border-color .15s', textAlign: 'center' },
  checkLabel: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b', cursor: 'pointer', lineHeight: 1.6, justifyContent: 'center' },
  check: { accentColor: '#dc2626', cursor: 'pointer', flexShrink: 0, width: 15, height: 15 },
  errBox: { background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#fca5a5', borderRadius: 8, padding: '10px 14px', fontSize: 13, textAlign: 'center' },
  submitBtn: { background: '#dc2626', color: '#fff', border: 'none', borderRadius: 14, padding: '20px', fontSize: 19, fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 24px rgba(220,38,38,.5)', width: '100%', letterSpacing: '-.3px' },
  formNote: { textAlign: 'center', fontSize: 11, color: '#475569' },

  statsBar: { display: 'flex', background: '#080f20', borderTop: '1px solid #0f172a', borderBottom: '1px solid #0f172a' },
  statItem: { flex: 1, padding: '18px 8px', textAlign: 'center', borderRight: '1px solid #0f172a' },
  statVal: { fontSize: 'clamp(1rem,3vw,1.5rem)', fontWeight: 900, marginBottom: 3 },
  statLbl: { color: '#475569', fontSize: 10 },

  sec: { padding: '60px 20px', background: '#060d1f' },
  secInner: { maxWidth: 680, margin: '0 auto' },
  secEyebrow: { display: 'block', textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#86efac', background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 20, padding: '4px 14px', width: 'fit-content', margin: '0 auto 12px' },
  secTitle: { fontSize: 'clamp(1.5rem,5vw,2.2rem)', fontWeight: 900, textAlign: 'center', marginBottom: 32, lineHeight: 1.3, color: '#f1f5f9' },

  painGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 },
  painCard: { background: '#0a1628', border: '1px solid #0f172a', borderRadius: 12, padding: '18px 14px', display: 'flex', flexDirection: 'column', gap: 10 },

  reviewList: { display: 'flex', flexDirection: 'column', gap: 12 },
  reviewCard: { background: '#060d1f', border: '1px solid #0f172a', borderRadius: 14, padding: '18px' },
  reviewTop: { display: 'flex', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#0f2a4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 15, color: '#93c5fd', flexShrink: 0 },

  footer: { background: '#04080f', borderTop: '1px solid #0f172a', padding: '32px 20px' },
  footerInner: { maxWidth: 680, margin: '0 auto', textAlign: 'center' },
  footerLogo: { fontSize: '1rem', fontWeight: 900, color: '#334155', display: 'block', marginBottom: 10 },
  footerTxt: { fontSize: 11, color: '#334155', lineHeight: 1.8 },
}
