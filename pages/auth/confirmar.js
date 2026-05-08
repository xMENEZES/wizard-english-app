import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import Head from 'next/head'

export default function Confirmar() {
  const [sessao, setSessao] = useState(null)
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [verificando, setVerificando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return

    const code = router.query.code

    if (code) {
      // Fluxo PKCE — troca o código por sessão
      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (data?.session) { setSessao(data.session); setVerificando(false) }
        else { setErro('Link inválido ou expirado.'); setVerificando(false) }
      })
    } else {
      // Fluxo hash — supabase-js processa automaticamente
      setTimeout(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSessao(session || null)
          setVerificando(false)
        })
      }, 600)
    }
  }, [router.isReady, router.query])

  const definirSenha = async (e) => {
    e.preventDefault()
    setErro('')
    if (senha.length < 6) { setErro('A senha deve ter pelo menos 6 caracteres.'); return }
    if (senha !== confirmar) { setErro('As senhas não coincidem.'); return }
    setSalvando(true)
    const { error } = await supabase.auth.updateUser({ password: senha })
    if (error) { setErro('Erro ao salvar: ' + error.message); setSalvando(false) }
    else router.push('/exercicios')
  }

  if (verificando) return (
    <div style={s.loading}>Verificando convite...</div>
  )

  if (!sessao) return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>⚠️</div>
        <h2 style={s.titulo}>Link inválido</h2>
        <p style={{color:'#666',fontSize:'.9rem',lineHeight:1.5}}>
          Este link de convite é inválido ou já foi utilizado.
          Solicite um novo convite ao administrador.
        </p>
      </div>
    </div>
  )

  return (
    <>
      <Head><title>Wizard English W1 - Definir Senha</title></Head>
      <div style={s.page}>
        <div style={s.card}>
          <div style={s.logo}>🎓</div>
          <h1 style={s.titulo}>Wizard English W1</h1>
          <p style={s.sub}>Defina sua senha para começar a estudar</p>
          <form onSubmit={definirSenha}>
            <div style={s.campo}>
              <label style={s.label}>Nova senha</label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                style={s.input}
              />
            </div>
            <div style={s.campo}>
              <label style={s.label}>Confirmar senha</label>
              <input
                type="password"
                value={confirmar}
                onChange={e => setConfirmar(e.target.value)}
                placeholder="Repita a senha"
                required
                style={s.input}
              />
            </div>
            {erro && <div style={s.erro}>{erro}</div>}
            <button type="submit" disabled={salvando} style={s.btn}>
              {salvando ? 'Salvando...' : 'Definir senha e entrar'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

const s = {
  loading: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', fontFamily:'Segoe UI,sans-serif', color:'#1b5e20', fontSize:'1rem' },
  page: { minHeight:'100vh', background:'#eef4ee', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' },
  card: { background:'#fff', borderRadius:'16px', padding:'40px 36px', maxWidth:'400px', width:'100%', boxShadow:'0 4px 24px rgba(0,0,0,.12)', textAlign:'center' },
  logo: { fontSize:'3rem', marginBottom:'10px' },
  titulo: { fontSize:'1.5rem', color:'#1b5e20', fontWeight:800, marginBottom:'4px' },
  sub: { color:'#666', fontSize:'.9rem', marginBottom:'28px' },
  campo: { textAlign:'left', marginBottom:'16px' },
  label: { display:'block', fontSize:'.85rem', fontWeight:600, color:'#333', marginBottom:'6px' },
  input: { width:'100%', border:'2px solid #e0e0e0', borderRadius:'9px', padding:'10px 14px', fontSize:'1rem', outline:'none', transition:'border .2s', fontFamily:'inherit' },
  erro: { background:'#ffebee', color:'#c62828', borderRadius:'8px', padding:'10px 14px', fontSize:'.88rem', marginBottom:'14px', borderLeft:'4px solid #c62828' },
  btn: { width:'100%', background:'#43a047', color:'#fff', border:'none', borderRadius:'9px', padding:'12px', fontSize:'1rem', fontWeight:700, cursor:'pointer', marginTop:'4px' },
}
