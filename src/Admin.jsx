import { useState, useEffect } from 'react'
import logoSvg from './assets/logo.svg'

const ADMIN_ID = 'bitline'
const ADMIN_PW = 'bitline2026!'
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw8lBInlXfIfyGLajUkwB6DmMufRijcSpB8UgqFVO5ojowwWX0-jjz2P1rZBu_65UT5yw/exec'

// ─────────────────────────────────────────────────────
//  관리자 로그인
// ─────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')

  const login = (e) => {
    e.preventDefault()
    if (id === ADMIN_ID && pw === ADMIN_PW) {
      sessionStorage.setItem('bl_admin', '1')
      onLogin()
    } else {
      setErr('아이디 또는 비밀번호가 올바르지 않습니다.')
    }
  }

  return (
    <div style={A.loginWrap}>
      <div style={A.loginCard}>
        <img src={logoSvg} alt="비트라인" style={{ height: 38, marginBottom: 28 }} />
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>관리자 로그인</div>
        <div style={{ color: '#64748b', fontSize: 13, marginBottom: 28 }}>비트라인 관리자 전용 페이지</div>
        <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input style={A.input} placeholder="아이디" value={id} onChange={e => setId(e.target.value)} />
          <input style={A.input} type="password" placeholder="비밀번호" value={pw} onChange={e => setPw(e.target.value)} />
          {err && <div style={{ color: '#ef4444', fontSize: 13 }}>{err}</div>}
          <button type="submit" style={A.btnRed}>로그인</button>
        </form>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────
//  대시보드
// ─────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(!!sessionStorage.getItem('bl_admin'))
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (authed) load()
  }, [authed])

  const load = async () => {
    try {
      const res = await fetch(`${APPS_SCRIPT_URL}?action=getSubmissions`)
      const json = await res.json()
      setData(json.reverse())
    } catch {
      // fallback: 로컬
      const raw = JSON.parse(localStorage.getItem('bitline_submissions') || '[]')
      setData(raw)
    }
  }

  const logout = () => {
    sessionStorage.removeItem('bl_admin')
    setAuthed(false)
  }

  const deleteRow = async (id) => {
    if (!confirm('삭제하시겠습니까?')) return
    try {
      await fetch(`${APPS_SCRIPT_URL}?action=deleteRow&id=${id}`, { mode: 'no-cors' })
    } catch (_) {}
    const next = data.filter(d => String(d.id) !== String(id))
    setData(next)
    setSelected(null)
  }

  const exportCSV = () => {
    const header = '신청일시,이름,연락처,개인정보동의,마케팅동의'
    const rows = data.map(d =>
      `"${d.createdAt}","${d.name}","${d.phone}","${d.agreePrivacy ? '동의' : '미동의'}","${d.agreeMarketing ? '동의' : '미동의'}"`
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `비트라인_신청자_${new Date().toLocaleDateString('ko-KR').replace(/\. /g, '-').replace('.', '')}.csv`
    a.click()
  }

  if (!authed) return <LoginPage onLogin={() => setAuthed(true)} />

  const filtered = data.filter(d =>
    d.name?.includes(search) || d.phone?.includes(search)
  )

  const today = new Date().toLocaleDateString('ko-KR')
  const todayCount = data.filter(d => d.createdAt?.startsWith(today)).length
  const agreeCount = data.filter(d => d.agreeMarketing).length

  return (
    <div style={A.root}>
      {/* 헤더 */}
      <header style={A.header}>
        <div style={A.headerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={logoSvg} alt="비트라인" style={{ height: 34 }} />
            <span style={{ color: '#94a3b8', fontSize: 13 }}>관리자 대시보드</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ color: '#475569', fontSize: 13 }}>관리자</span>
            <button onClick={logout} style={A.btnGhost}>로그아웃</button>
          </div>
        </div>
      </header>

      <div style={A.body}>

        {/* 통계 카드 */}
        <div style={A.statsRow}>
          {[
            { label: '전체 신청자', value: data.length + '명',    color: '#3b82f6' },
            { label: '오늘 신청',   value: todayCount + '명',     color: '#22c55e' },
            { label: '마케팅 동의', value: agreeCount + '명',     color: '#f59e0b' },
            { label: '전환율',      value: data.length ? Math.round(agreeCount / data.length * 100) + '%' : '0%', color: '#ef4444' },
          ].map((s, i) => (
            <div key={i} style={{ ...A.statCard, borderTop: `3px solid ${s.color}` }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* 툴바 */}
        <div style={A.toolbar}>
          <div style={A.secTitle}>신청자 목록</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              style={{ ...A.input, width: 220, padding: '8px 14px' }}
              placeholder="이름 / 연락처 검색"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button onClick={load} style={A.btnGhost}>새로고침</button>
            <button onClick={exportCSV} style={{ ...A.btnRed, padding: '8px 18px', fontSize: 13 }}>
              CSV 내보내기
            </button>
          </div>
        </div>

        {/* 테이블 */}
        <div style={A.tableWrap}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569' }}>
              {search ? '검색 결과가 없습니다.' : '아직 신청자가 없습니다.'}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['#', '신청일시', '이름', '연락처', '유입경로', '개인정보 동의', '마케팅 동의', '관리'].map(h => (
                    <th key={h} style={A.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <tr key={d.id} style={{ ...A.tr, background: selected === d.id ? 'rgba(59,130,246,.07)' : '' }}
                    onClick={() => setSelected(selected === d.id ? null : d.id)}>
                    <td style={{ ...A.td, color: '#475569', width: 40 }}>{filtered.length - i}</td>
                    <td style={{ ...A.td, fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>{d.createdAt}</td>
                    <td style={{ ...A.td, fontWeight: 700 }}>{d.name}</td>
                    <td style={{ ...A.td }}>{d.phone}</td>
                    <td style={A.td}>
                      <span style={{ ...A.badge, background: d.source === 'lead' ? 'rgba(251,191,36,.12)' : 'rgba(59,130,246,.12)', color: d.source === 'lead' ? '#fbbf24' : '#60a5fa' }}>
                        {d.source === 'lead' ? '광고' : '메인'}
                      </span>
                    </td>
                    <td style={A.td}>
                      <span style={{ ...A.badge, background: d.agreePrivacy ? 'rgba(34,197,94,.12)' : 'rgba(239,68,68,.12)', color: d.agreePrivacy ? '#22c55e' : '#ef4444' }}>
                        {d.agreePrivacy ? '동의' : '미동의'}
                      </span>
                    </td>
                    <td style={A.td}>
                      <span style={{ ...A.badge, background: d.agreeMarketing ? 'rgba(34,197,94,.12)' : 'rgba(100,116,139,.12)', color: d.agreeMarketing ? '#22c55e' : '#64748b' }}>
                        {d.agreeMarketing ? '동의' : '미동의'}
                      </span>
                    </td>
                    <td style={A.td} onClick={e => e.stopPropagation()}>
                      <button onClick={() => deleteRow(d.id)} style={A.btnDel}>삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────
//  스타일
// ─────────────────────────────────────────────────────
const A = {
  root: { minHeight: '100vh', background: '#060d1f', color: '#e2e8f0', fontFamily: "'Segoe UI', system-ui, sans-serif" },

  loginWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060d1f' },
  loginCard: { background: '#0a1628', border: '1px solid #0f172a', borderRadius: 16, padding: '40px 48px', width: 360, textAlign: 'center' },

  header: { background: 'rgba(6,13,31,0.97)', borderBottom: '1px solid #0f172a', position: 'sticky', top: 0, zIndex: 100 },
  headerInner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', height: 64, maxWidth: 1400, margin: '0 auto' },

  body: { padding: '32px 40px', maxWidth: 1400, margin: '0 auto' },

  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 },
  statCard: { background: '#0a1628', border: '1px solid #0f172a', borderRadius: 14, padding: '22px 24px' },

  toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 },
  secTitle: { fontWeight: 800, fontSize: 16 },

  tableWrap: { background: '#0a1628', border: '1px solid #0f172a', borderRadius: 14, overflow: 'hidden' },

  th: { textAlign: 'left', fontSize: 11, color: '#475569', padding: '14px 16px', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid #0f172a', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #0f172a', cursor: 'pointer', transition: 'background .12s' },
  td: { padding: '14px 16px', fontSize: 14 },
  badge: { display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 },

  input: { background: '#060d1f', border: '1px solid #1e293b', borderRadius: 8, padding: '11px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none' },
  btnRed: { background: '#dc2626', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  btnGhost: { background: 'transparent', color: '#94a3b8', border: '1px solid #1e293b', padding: '8px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer' },
  btnDel: { background: 'rgba(239,68,68,.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,.2)', padding: '4px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600 },
}
