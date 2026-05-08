import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import Head from 'next/head'

export default function Exercicios() {
  const [sessao, setSessao] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/'); return }
      setSessao(session)
      setCarregando(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) router.push('/')
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!carregando && sessao) {
      const s = document.createElement('script')
      s.id = 'ex-script'
      s.textContent = EXERCISES_JS
      document.body.appendChild(s)
      return () => { const el = document.getElementById('ex-script'); if(el) el.remove() }
    }
  }, [carregando, sessao])

  const sair = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (carregando) return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',background:'#eef4ee',fontFamily:'Segoe UI,sans-serif',color:'#1b5e20',fontSize:'1.1rem'}}>
      Carregando...
    </div>
  )

  return (
    <>
      <Head><title>Wizard English W1 - Exercicios</title></Head>
      <style dangerouslySetInnerHTML={{__html: EXERCISES_CSS}} />
      <div style={{background:'#155216',color:'#fff',padding:'7px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:'.82rem'}}>
        <span>Logado como: <strong>{sessao.user.email}</strong></span>
        <button onClick={sair} style={{background:'rgba(255,255,255,.18)',border:'1px solid rgba(255,255,255,.5)',color:'#fff',padding:'4px 14px',borderRadius:'20px',cursor:'pointer',fontSize:'.8rem'}}>Sair</button>
      </div>
      <div dangerouslySetInnerHTML={{__html: EXERCISES_BODY}} />
    </>
  )
}

const EXERCISES_CSS = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#eef4ee;min-height:100vh}
  .app-header{background:linear-gradient(135deg,#1b5e20,#43a047);color:#fff;padding:14px 22px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 3px 10px rgba(0,0,0,.25);position:sticky;top:0;z-index:100}
  .app-header h1{font-size:1.25rem;letter-spacing:.5px}
  .back-btn{background:rgba(255,255,255,.2);border:2px solid #fff;color:#fff;padding:7px 18px;border-radius:20px;cursor:pointer;font-size:.85rem;font-weight:600;transition:.2s;display:none}
  .back-btn:hover{background:#fff;color:#1b5e20}
  .screen{display:none;padding:22px;max-width:820px;margin:0 auto}
  .screen.active{display:block}
  .home-hero{text-align:center;padding:28px 0 18px}
  .home-hero h2{font-size:1.9rem;color:#1b5e20;margin-bottom:6px}
  .home-hero p{color:#666;font-size:.95rem}
  .units-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px;margin-top:18px}
  .unit-card{background:#fff;border-radius:14px;padding:20px 18px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.09);transition:.3s;border-left:5px solid #43a047;text-align:center}
  .unit-card:hover{transform:translateY(-4px);box-shadow:0 8px 22px rgba(0,0,0,.14)}
  .unit-num{font-size:2.2rem;color:#43a047;font-weight:800;line-height:1}
  .unit-title{font-size:1rem;font-weight:700;color:#222;margin:6px 0 3px}
  .unit-desc{font-size:.78rem;color:#888}
  .unit-badge{margin-top:9px;font-size:.78rem;font-weight:700;color:#43a047}
  .unit-hdr{background:linear-gradient(135deg,#1b5e20,#43a047);color:#fff;padding:18px 20px;border-radius:14px;margin-bottom:18px}
  .unit-hdr h2{font-size:1.45rem;margin-bottom:4px}
  .unit-hdr p{opacity:.85;font-size:.88rem}
  .prog-wrap{background:#ddd;border-radius:10px;height:8px;margin-bottom:6px}
  .prog-bar{background:linear-gradient(90deg,#43a047,#81c784);height:100%;border-radius:10px;transition:width .4s}
  .prog-label{text-align:right;font-size:.78rem;color:#777;margin-bottom:16px}
  .ex-card{background:#fff;border-radius:14px;padding:22px;margin-bottom:18px;box-shadow:0 2px 8px rgba(0,0,0,.08)}
  .ex-type-tag{display:inline-block;padding:3px 12px;border-radius:20px;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.4px;margin-bottom:12px}
  .tag-mc{background:#e8f5e9;color:#1b5e20}
  .tag-fill{background:#e3f2fd;color:#1565c0}
  .tag-translate{background:#fce4ec;color:#880e4f}
  .ex-question{font-size:1.05rem;font-weight:600;color:#1a1a1a;margin-bottom:16px;line-height:1.65}
  .opts-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
  .opt-btn{padding:11px 14px;border:2px solid #e0e0e0;border-radius:9px;cursor:pointer;background:#fff;font-size:.92rem;text-align:left;transition:.18s;color:#333}
  .opt-btn:hover:not(:disabled){border-color:#43a047;background:#f1f8f1}
  .opt-btn.selected{border-color:#43a047;background:#e8f5e9}
  .opt-btn.correct{border-color:#2e7d32!important;background:#e8f5e9!important;color:#1b5e20!important;font-weight:700}
  .opt-btn.wrong{border-color:#c62828!important;background:#ffebee!important;color:#b71c1c!important;font-weight:700}
  .fill-input{border:2px solid #e0e0e0;border-radius:9px;padding:10px 14px;font-size:.98rem;width:100%;outline:none;transition:.2s;margin-bottom:14px}
  .fill-input:focus{border-color:#43a047}
  .fill-input.correct{border-color:#2e7d32;background:#e8f5e9;color:#1b5e20}
  .fill-input.wrong{border-color:#c62828;background:#ffebee;color:#b71c1c}
  .btn-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:4px}
  .check-btn{background:#43a047;color:#fff;border:none;padding:10px 24px;border-radius:9px;cursor:pointer;font-size:.92rem;font-weight:700;transition:.2s}
  .check-btn:hover:not(:disabled){background:#1b5e20}
  .check-btn:disabled{background:#bdbdbd;cursor:not-allowed}
  .next-btn{background:#1565c0;color:#fff;border:none;padding:10px 24px;border-radius:9px;cursor:pointer;font-size:.92rem;font-weight:700;transition:.2s;display:none}
  .next-btn:hover{background:#0d47a1}
  .next-btn.show{display:inline-block}
  .feedback{padding:11px 15px;border-radius:9px;font-size:.93rem;margin-top:12px;display:none;line-height:1.5}
  .feedback.show{display:block}
  .feedback.ok{background:#e8f5e9;color:#1b5e20;border-left:4px solid #2e7d32}
  .feedback.err{background:#ffebee;color:#b71c1c;border-left:4px solid #c62828}
  .score-card{background:#fff;border-radius:14px;padding:30px 22px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.09);margin-bottom:20px;display:none}
  .score-card.show{display:block}
  .score-ring{width:110px;height:110px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.9rem;font-weight:800;color:#fff;margin:0 auto 16px;box-shadow:0 4px 14px rgba(0,0,0,.18)}
  .score-msg{font-size:1.2rem;font-weight:700;color:#222;margin-bottom:6px}
  .score-sub{color:#666;font-size:.92rem}
  .retry-btn{background:#ef6c00;color:#fff;border:none;padding:11px 26px;border-radius:9px;cursor:pointer;font-size:.95rem;font-weight:700;margin-top:16px;transition:.2s}
  .retry-btn:hover{background:#e65100}
  .home-btn2{background:#43a047;color:#fff;border:none;padding:11px 26px;border-radius:9px;cursor:pointer;font-size:.95rem;font-weight:700;margin-top:16px;margin-left:10px;transition:.2s}
  .home-btn2:hover{background:#1b5e20}
  .vocab-section{background:#f9fbe7;border-radius:12px;padding:16px 18px;margin-bottom:20px;border:1px solid #dce775}
  .vocab-section h3{font-size:.9rem;text-transform:uppercase;letter-spacing:.5px;color:#558b2f;margin-bottom:10px}
  .vocab-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:5px}
  .vocab-item{font-size:.82rem;color:#444;padding:3px 0}
  .vocab-item strong{color:#1b5e20}
  @media(max-width:520px){.opts-grid{grid-template-columns:1fr}.units-grid{grid-template-columns:1fr 1fr}.app-header h1{font-size:1rem}}
`

const EXERCISES_BODY = `
<div class="app-header">
  <h1>&#127891; Wizard English W1</h1>
  <button class="back-btn" id="backBtn" onclick="goHome()">&#8592; Menu</button>
</div>
<div class="screen active" id="homeScreen">
  <div class="home-hero">
    <h2>Exercicios de Ingles</h2>
    <p>Baseado no livro <strong>Wizard W1</strong> &mdash; Selecione uma unidade para comecar</p>
  </div>
  <div class="units-grid">
    <div class="unit-card" onclick="openUnit(1)"><div class="unit-num">1</div><div class="unit-title">I drink / I eat</div><div class="unit-desc">Alimentos, bebidas e verbos basicos</div><div class="unit-badge" id="badge1">Nao iniciado</div></div>
    <div class="unit-card" onclick="openUnit(2)"><div class="unit-num">2</div><div class="unit-title">I speak / I study</div><div class="unit-desc">Idiomas, familia e negativa</div><div class="unit-badge" id="badge2">Nao iniciado</div></div>
    <div class="unit-card" onclick="openUnit(3)"><div class="unit-num">3</div><div class="unit-title">I work / I play</div><div class="unit-desc">Trabalho, esportes e horarios</div><div class="unit-badge" id="badge3">Nao iniciado</div></div>
    <div class="unit-card" onclick="openUnit(4)"><div class="unit-num">4</div><div class="unit-title">I like / I sleep</div><div class="unit-desc">Gostar, dormir, artigos a/an</div><div class="unit-badge" id="badge4">Nao iniciado</div></div>
    <div class="unit-card" onclick="openUnit(5)"><div class="unit-num">5</div><div class="unit-title">I want / I go</div><div class="unit-desc">Desejos, destinos e perguntas</div><div class="unit-badge" id="badge5">Nao iniciado</div></div>
    <div class="unit-card" onclick="openUnit(6)"><div class="unit-num">6</div><div class="unit-title">I have / I understand</div><div class="unit-desc">Posse, obrigacao e where</div><div class="unit-badge" id="badge6">Nao iniciado</div></div>
    <div class="unit-card" onclick="openUnit(7)"><div class="unit-num">7</div><div class="unit-title">I need / I prefer</div><div class="unit-desc">Necessidade, preferencia e comidas</div><div class="unit-badge" id="badge7">Nao iniciado</div></div>
  </div>
</div>
<div id="unitContainer"></div>
`

const EXERCISES_JS = `
var UNITS={
1:{title:"I drink / I eat",subtitle:"Verbos beber e comer - alimentos - bebidas - pronomes I e You",
vocab:[["coffee","cafe"],["tea","cha"],["milk","leite"],["juice","suco"],["water","agua"],["soda","refrigerante"],["fish","peixe"],["meat","carne"],["cheese","queijo"],["ham","presunto"],["bread","pao"],["I","eu"],["you","voce"]],
exercises:[
{type:"mc",q:"Qual e a traducao de 'milk'?",opts:["Suco","Leite","Agua","Cha"],ans:"Leite"},
{type:"mc",q:"Como se diz 'Eu bebo cafe' em ingles?",opts:["You drink coffee.","I eat coffee.","I drink coffee.","I drink milk."],ans:"I drink coffee."},
{type:"mc",q:"Qual e a traducao de 'I drink water and juice'?",opts:["Eu bebo leite e suco.","Eu bebo agua e suco.","Voce bebe agua e suco.","Eu como agua e suco."],ans:"Eu bebo agua e suco."},
{type:"mc",q:"Como se diz 'presunto' em ingles?",opts:["Bread","Cheese","Ham","Meat"],ans:"Ham"},
{type:"mc",q:"Qual e a traducao de 'I drink tea and soda'?",opts:["Eu bebo cha e refrigerante.","Voce bebe cha e suco.","Eu como cha e refrigerante.","Eu bebo leite e suco."],ans:"Eu bebo cha e refrigerante."},
{type:"mc",q:"Como se diz 'Eu como pao e voce come queijo'?",opts:["I eat bread and I drink cheese.","You eat bread and you eat cheese.","I eat bread and you eat cheese.","I drink bread and you eat cheese."],ans:"I eat bread and you eat cheese."},
{type:"mc",q:"Qual destas opcoes NAO e uma bebida?",opts:["Coffee","Juice","Bread","Milk"],ans:"Bread"},
{type:"mc",q:"Como se diz 'Eu bebo leite e voce bebe cafe'?",opts:["I drink milk and I drink coffee.","I drink milk and you drink coffee.","You drink milk and I drink coffee.","I eat milk and you drink coffee."],ans:"I drink milk and you drink coffee."},
{type:"mc",q:"Como se diz 'Eu como peixe e carne'?",opts:["I drink fish and meat.","I eat fish and meat.","You eat fish and meat.","I eat fish and drink meat."],ans:"I eat fish and meat."},
{type:"fill",q:"Complete: 'You ___ cheese.' (Voce come queijo.)",ans:"eat"},
{type:"fill",q:"Complete: 'I ___ bread and ham.' (Eu como pao e presunto.)",ans:"eat"},
{type:"fill",q:"Complete: 'I eat fish and I ___ soda.'",ans:"drink"},
{type:"fill",q:"Complete: 'I drink ___ and milk.' (Eu bebo cafe e leite.)",ans:"coffee"},
{type:"fill",q:"Complete: 'You ___ meat.' (Voce come carne.)",ans:"eat"},
{type:"translate",q:"Traduza para o ingles:\n'Eu bebo suco.'",ans:"I drink juice."},
{type:"translate",q:"Traduza para o ingles:\n'Voce come queijo.'",ans:"You eat cheese."},
{type:"translate",q:"Traduza para o ingles:\n'Eu como pao e presunto.'",ans:"I eat bread and ham."},
{type:"translate",q:"Traduza para o ingles:\n'Eu bebo cafe e leite.'",ans:"I drink coffee and milk."},
{type:"translate",q:"Traduza para o ingles:\n'Voce bebe agua.'",ans:"You drink water."},
{type:"translate",q:"Traduza para o ingles:\n'Eu como peixe e bebo suco.'",ans:"I eat fish and I drink juice."}
]},
2:{title:"I speak / I study",subtitle:"Verbos falar e estudar - familia - idiomas - negativa com don't",
vocab:[["father","pai"],["mother","mae"],["brother","irmao"],["sister","irma"],["son","filho"],["daughter","filha"],["children","filhos"],["friend","amigo(a)"],["my","meu/minha"],["your","seu/sua"],["with","com"],["English","ingles"],["Spanish","espanhol"],["French","frances"],["Portuguese","portugues"]],
exercises:[
{type:"mc",q:"Como se diz 'Eu falo ingles'?",opts:["You speak English.","I study English.","I speak English.","I speak French."],ans:"I speak English."},
{type:"mc",q:"Como se diz 'Eu nao falo frances'?",opts:["I don't study French.","I don't speak French.","You don't speak French.","I speak French not."],ans:"I don't speak French."},
{type:"mc",q:"Qual e a traducao de 'brother'?",opts:["Pai","Filho","Irmao","Amigo"],ans:"Irmao"},
{type:"mc",q:"Como se diz 'Voce estuda portugues com seu pai'?",opts:["You study Portuguese with your mother.","I study Portuguese with my father.","You speak Portuguese with your father.","You study Portuguese with your father."],ans:"You study Portuguese with your father."},
{type:"mc",q:"Como se diz 'meu/minha' em ingles?",opts:["You","Your","My","I"],ans:"My"},
{type:"mc",q:"Qual e a forma negativa correta de 'I speak'?",opts:["I not speak","I don't speak","I doesn't speak","I am not speak"],ans:"I don't speak"},
{type:"mc",q:"Como se diz 'Voce fala espanhol'?",opts:["I speak Spanish.","You study Spanish.","You speak Spanish.","You speak Portuguese."],ans:"You speak Spanish."},
{type:"mc",q:"Como se diz 'Eu estudo ingles com meus filhos'?",opts:["I study English with my children.","You study English with my children.","I speak English with my children.","I study English with my son."],ans:"I study English with my children."},
{type:"fill",q:"Complete: 'I ___ Spanish.' (Eu estudo espanhol.)",ans:"study"},
{type:"fill",q:"Complete: 'I speak English with my ___.' (meu filho)",ans:"son"},
{type:"fill",q:"Complete: 'I don't ___ with my sister.'",ans:"study"},
{type:"fill",q:"Complete: 'You speak French with ___ child.'",ans:"your"},
{type:"fill",q:"Complete: 'I don't speak ___ with my brother.'",ans:"Spanish"},
{type:"fill",q:"Complete: 'You speak English with your ___.' (filha)",ans:"daughter"},
{type:"translate",q:"Traduza para o ingles:\n'Eu falo portugues.'",ans:"I speak Portuguese."},
{type:"translate",q:"Traduza para o ingles:\n'Voce estuda frances.'",ans:"You study French."},
{type:"translate",q:"Traduza para o ingles:\n'Eu nao estudo espanhol.'",ans:"I don't study Spanish."},
{type:"translate",q:"Traduza para o ingles:\n'Eu falo ingles com minha irma.'",ans:"I speak English with my sister."},
{type:"translate",q:"Traduza para o ingles:\n'Voce fala espanhol com seu pai.'",ans:"You speak Spanish with your father."},
{type:"translate",q:"Traduza para o ingles:\n'Eu estudo frances com meus filhos.'",ans:"I study French with my children."}
]},
3:{title:"I work / I play",subtitle:"Trabalho - lazer - esportes - instrumentos - locais - horarios",
vocab:[["school","escola"],["home","casa"],["store","loja"],["bank","banco"],["alone","sozinho"],["but","mas"],["only","so/somente"],["here","aqui"],["there","la"],["soccer","futebol"],["tennis","tenis"],["volleyball","volei"],["basketball","basquete"],["chess","xadrez"],["piano","piano"],["guitar","violao"],["violin","violino"]],
exercises:[
{type:"mc",q:"Como se diz 'Eu trabalho de manha'?",opts:["I work at night.","I work in the morning.","I work in the afternoon.","I play in the morning."],ans:"I work in the morning."},
{type:"mc",q:"Qual e a traducao de 'I play soccer'?",opts:["Eu jogo basquete.","Eu jogo futebol.","Eu jogo tenis.","Eu toco guitarra."],ans:"Eu jogo futebol."},
{type:"mc",q:"Qual frase usa 'the' corretamente com instrumento?",opts:["I play guitar.","I play the guitar.","I play a guitar.","I play of guitar."],ans:"I play the guitar."},
{type:"mc",q:"Como se diz 'a tarde' em ingles?",opts:["In the morning","In the evening","At night","In the afternoon"],ans:"In the afternoon"},
{type:"mc",q:"Qual e a traducao de 'I study, but I don't work'?",opts:["Eu trabalho, mas nao estudo.","Eu estudo e trabalho.","Eu estudo, mas nao trabalho.","Voce estuda, mas nao trabalha."],ans:"Eu estudo, mas nao trabalho."},
{type:"mc",q:"Como se diz 'xadrez' em ingles?",opts:["Soccer","Chess","Basketball","Tennis"],ans:"Chess"},
{type:"mc",q:"Qual frase esta CORRETA para esporte?",opts:["I play volleyball the.","I play the volleyball.","I play volleyball.","I play a volleyball."],ans:"I play volleyball."},
{type:"mc",q:"Como se diz 'Eu nao trabalho a noite'?",opts:["I don't work at night.","I don't work in the morning.","You don't work at night.","I don't play at night."],ans:"I don't work at night."},
{type:"fill",q:"Complete: 'I work ___ a bank.'",ans:"at"},
{type:"fill",q:"Complete: 'You work ___.' (Voce trabalha la.)",ans:"there"},
{type:"fill",q:"Complete: 'I only work in the ___.'",ans:"morning"},
{type:"fill",q:"Complete: 'I play soccer, ___ I don't play volleyball.'",ans:"but"},
{type:"fill",q:"Complete: 'I work ___ the morning.'",ans:"in"},
{type:"fill",q:"Complete: 'I play ___ guitar.'",ans:"the"},
{type:"translate",q:"Traduza para o ingles:\n'Eu trabalho em casa.'",ans:"I work at home."},
{type:"translate",q:"Traduza para o ingles:\n'Voce trabalha a tarde.'",ans:"You work in the afternoon."},
{type:"translate",q:"Traduza para o ingles:\n'Eu jogo volei com meu amigo.'",ans:"I play volleyball with my friend."},
{type:"translate",q:"Traduza para o ingles:\n'Eu toco piano.'",ans:"I play the piano."},
{type:"translate",q:"Traduza para o ingles:\n'Eu so trabalho de manha.'",ans:"I only work in the morning."},
{type:"translate",q:"Traduza para o ingles:\n'Voce joga tenis.'",ans:"You play tennis."}
]},
4:{title:"I like / I sleep",subtitle:"Gostar - dormir - like to - artigos a/an - adjetivos - refeicoes",
vocab:[["book","livro"],["car","carro"],["house","casa"],["big","grande"],["small","pequeno"],["new","novo"],["old","velho"],["husband","marido"],["wife","esposa"],["apple","maca"],["orange","laranja"],["breakfast","cafe da manha"],["lunch","almoco"],["dinner","jantar"]],
exercises:[
{type:"mc",q:"Como se diz 'Eu gosto de estudar'?",opts:["I like study.","I like to study.","I like studying to.","I like for study."],ans:"I like to study."},
{type:"mc",q:"Qual e o artigo correto? '___ apple'",opts:["A","An","The","---"],ans:"An"},
{type:"mc",q:"Como se diz 'Eu nao gosto de dormir'?",opts:["I like to sleep.","I don't like sleep.","I don't like to sleep.","I not like to sleep."],ans:"I don't like to sleep."},
{type:"mc",q:"Como se diz 'um professor de ingles' corretamente?",opts:["A English teacher","An English teacher","The English teacher","A teacher English"],ans:"An English teacher"},
{type:"mc",q:"Qual e a traducao de 'an old house'?",opts:["uma casa nova","uma casa grande","uma casa velha","uma casa pequena"],ans:"uma casa velha"},
{type:"mc",q:"Qual frase usa 'a/an' CORRETAMENTE?",opts:["An big car","A old house","A new book","An small store"],ans:"A new book"},
{type:"mc",q:"Como se diz 'no cafe da manha'?",opts:["For lunch","For breakfast","For dinner","In the morning"],ans:"For breakfast"},
{type:"mc",q:"Qual e a pergunta correta: 'Voce gosta de jogar?'",opts:["You like to play?","Do you like play?","Do you like to play?","Does you like to play?"],ans:"Do you like to play?"},
{type:"fill",q:"Complete: '___ you like to work?'",ans:"Do"},
{type:"fill",q:"Complete: 'I drink ___ glass of milk.'",ans:"a"},
{type:"fill",q:"Complete: 'I sleep ___ night.'",ans:"at"},
{type:"fill",q:"Complete: 'Do you like to study ___?'",ans:"alone"},
{type:"fill",q:"Complete: 'I don't like to ___ soda.'",ans:"drink"},
{type:"fill",q:"Complete: 'I eat ___ apple for breakfast.'",ans:"an"},
{type:"translate",q:"Traduza para o ingles:\n'Eu gosto de trabalhar.'",ans:"I like to work."},
{type:"translate",q:"Traduza para o ingles:\n'Eu nao gosto de jogar.'",ans:"I don't like to play."},
{type:"translate",q:"Traduza para o ingles:\n'Eu durmo de manha.'",ans:"I sleep in the morning."},
{type:"translate",q:"Traduza para o ingles:\n'Eu gosto do meu carro.'",ans:"I like my car."},
{type:"translate",q:"Traduza para o ingles:\n'Eu gosto de falar com voce.'",ans:"I like to speak with you."},
{type:"translate",q:"Traduza para o ingles:\n'Voce gosta de estudar em casa?'",ans:"Do you like to study at home?"}
]},
5:{title:"I want / I go",subtitle:"Querer - ir - destinos - perguntas com What / Where / How",
vocab:[["movies","cinema"],["park","parque"],["church","igreja"],["downtown","centro da cidade"],["office","escritorio"],["boss","chefe"],["neighbor","vizinho"],["day","dia"],["week","semana"],["tomorrow","amanha"],["what","o que/qual"],["how","como"]],
exercises:[
{type:"mc",q:"Como se diz 'Eu quero ir ao cinema'?",opts:["I want to go to the park.","I want to go to the movies.","I go to the movies.","I want the movies."],ans:"I want to go to the movies."},
{type:"mc",q:"Como se diz 'O que voce come?'",opts:["Where do you eat?","What do you eat?","What you eat?","Do you eat what?"],ans:"What do you eat?"},
{type:"mc",q:"Qual e a traducao de 'I want to go downtown'?",opts:["Eu quero ir a escola.","Eu quero ir ao parque.","Eu quero ir ao centro.","Eu quero ir a igreja."],ans:"Eu quero ir ao centro."},
{type:"mc",q:"Qual e a pergunta correta para 'O que voce quer?'",opts:["What do you like?","Where do you want?","What do you want?","How do you want?"],ans:"What do you want?"},
{type:"mc",q:"Como se diz 'Eu quero estudar frances'?",opts:["I want French to study.","I want to speak French.","I want to study French.","I go to study French."],ans:"I want to study French."},
{type:"mc",q:"Qual palavra significa 'amanha'?",opts:["Today","Tomorrow","Yesterday","Now"],ans:"Tomorrow"},
{type:"mc",q:"Como se diz 'O que voce gosta de comer?'",opts:["What do you want to eat?","What do you like to eat?","Where do you like to eat?","What you like eat?"],ans:"What do you like to eat?"},
{type:"mc",q:"Qual frase esta CORRETA?",opts:["I want go to the park.","I want to go to the park.","I want going to the park.","I wants to go to the park."],ans:"I want to go to the park."},
{type:"fill",q:"Complete: 'I want to go ___.' (para casa)",ans:"home"},
{type:"fill",q:"Complete: '___ do you spell your name?'",ans:"How"},
{type:"fill",q:"Complete: 'I want to go to the ___.' (parque)",ans:"park"},
{type:"fill",q:"Complete: 'I want to go to ___.' (escola)",ans:"school"},
{type:"fill",q:"Complete: 'What do you ___ to drink?'",ans:"want"},
{type:"fill",q:"Complete: 'I want to go to the ___.' (igreja)",ans:"church"},
{type:"translate",q:"Traduza para o ingles:\n'Eu quero ir ao parque.'",ans:"I want to go to the park."},
{type:"translate",q:"Traduza para o ingles:\n'Eu quero ir para casa.'",ans:"I want to go home."},
{type:"translate",q:"Traduza para o ingles:\n'O que voce bebe?'",ans:"What do you drink?"},
{type:"translate",q:"Traduza para o ingles:\n'Eu quero dormir agora.'",ans:"I want to sleep now."},
{type:"translate",q:"Traduza para o ingles:\n'Eu quero falar so ingles.'",ans:"I want to speak only English."},
{type:"translate",q:"Traduza para o ingles:\n'O que voce quer estudar?'",ans:"What do you want to study?"}
]},
6:{title:"I have / I understand",subtitle:"Ter (posse) - have to (obrigacao) - entender - Where",
vocab:[["cat","gato"],["dog","cachorro"],["bicycle","bicicleta"],["table","mesa"],["every","todo/cada"],["too","tambem"],["also","tambem"],["where","onde"],["time","tempo"],["German","alemao"],["Chinese","chines"],["weekend","fim de semana"]],
exercises:[
{type:"mc",q:"Como se diz 'Eu tenho um gato'?",opts:["I have a dog.","You have a cat.","I have a cat.","I have cat."],ans:"I have a cat."},
{type:"mc",q:"Como se diz 'Onde voce trabalha?'",opts:["When do you work?","Where do you work?","What do you work?","How do you work?"],ans:"Where do you work?"},
{type:"mc",q:"Qual e a traducao de 'You have to eat'?",opts:["Voce gosta de comer.","Voce quer comer.","Voce precisa comer.","Voce tem que comer."],ans:"Voce tem que comer."},
{type:"mc",q:"Como se diz 'Voce entende alemao'?",opts:["You understand Chinese.","I understand German.","You understand German.","You understand French."],ans:"You understand German."},
{type:"mc",q:"Diferenca entre 'I have a car' e 'I have to work':",opts:["Nao ha diferenca","'I have a car'=posse; 'I have to work'=obrigacao","'I have a car'=obrigacao; 'I have to work'=posse","Ambos indicam obrigacao"],ans:"'I have a car'=posse; 'I have to work'=obrigacao"},
{type:"mc",q:"Como se diz 'bicicleta' em ingles?",opts:["Table","Bicycle","Car","Dog"],ans:"Bicycle"},
{type:"mc",q:"Como se diz 'Eu tenho que ir agora'?",opts:["I want to go now.","I need to go now.","I have to go now.","I go now."],ans:"I have to go now."},
{type:"mc",q:"Como se diz 'Eu tenho tempo'?",opts:["I have to time.","I have a time.","I have time.","I have the time."],ans:"I have time."},
{type:"fill",q:"Complete: 'I have ___ study.'",ans:"to"},
{type:"fill",q:"Complete: 'I understand ___.' (ingles)",ans:"English"},
{type:"fill",q:"Complete: '___ do you like to go on weekends?'",ans:"Where"},
{type:"fill",q:"Complete: 'You understand ___.' (me entende)",ans:"me"},
{type:"fill",q:"Complete: 'I have ___ go now.'",ans:"to"},
{type:"fill",q:"Complete: 'I have ___ bicycle.'",ans:"a"},
{type:"translate",q:"Traduza para o ingles:\n'Eu tenho um cachorro.'",ans:"I have a dog."},
{type:"translate",q:"Traduza para o ingles:\n'Voce tem que trabalhar.'",ans:"You have to work."},
{type:"translate",q:"Traduza para o ingles:\n'Eu entendo espanhol.'",ans:"I understand Spanish."},
{type:"translate",q:"Traduza para o ingles:\n'Onde voce estuda?'",ans:"Where do you study?"},
{type:"translate",q:"Traduza para o ingles:\n'Voce entende chines?'",ans:"Do you understand Chinese?"},
{type:"translate",q:"Traduza para o ingles:\n'Eu tenho que estudar ingles.'",ans:"I have to study English."}
]},
7:{title:"I need / I prefer",subtitle:"Precisar - preferir - alimentos - when - very much",
vocab:[["family","familia"],["city","cidade"],["mall","shopping"],["rice","arroz"],["beans","feijao"],["potato","batata"],["chicken","frango"],["turkey","peru"],["pork","carne de porco"],["steak","bife"],["salad","salada"],["vegetables","legumes"],["when","quando"],["sometimes","as vezes"],["very much","muito"]],
exercises:[
{type:"mc",q:"Como se diz 'Eu preciso estudar'?",opts:["I want to study.","I have to study.","I need to study.","I like to study."],ans:"I need to study."},
{type:"mc",q:"Qual e a traducao de 'Do you prefer soda or juice?'",opts:["Voce prefere cha ou leite?","Voce prefere refrigerante ou suco?","Voce precisa de refrigerante?","Voce quer refrigerante ou suco?"],ans:"Voce prefere refrigerante ou suco?"},
{type:"mc",q:"Como se diz 'Quando voce precisa ir ao banco?'",opts:["Where do you need to go to the bank?","When do you need to go to the bank?","What do you need to go to the bank?","When you need to go to the bank?"],ans:"When do you need to go to the bank?"},
{type:"mc",q:"Qual palavra significa 'frango' em ingles?",opts:["Turkey","Pork","Steak","Chicken"],ans:"Chicken"},
{type:"mc",q:"Como se diz 'Eu gosto muito de minha familia'?",opts:["I like my family a little.","I love my family.","I like my family very much.","I sometimes like my family."],ans:"I like my family very much."},
{type:"mc",q:"Qual palavra NAO e um alimento?",opts:["Rice","Beans","Salad","Piano"],ans:"Piano"},
{type:"mc",q:"Qual e a traducao de 'I prefer to eat here'?",opts:["Eu prefiro comer la.","Eu gosto de comer aqui.","Eu prefiro comer aqui.","Eu preciso comer aqui."],ans:"Eu prefiro comer aqui."},
{type:"mc",q:"Como se diz 'Voce prefere basquete ou volei?'",opts:["Do you prefer basketball or volleyball?","Do you like basketball or volleyball?","Do you need basketball or volleyball?","Do you want basketball or volleyball?"],ans:"Do you prefer basketball or volleyball?"},
{type:"fill",q:"Complete: 'I prefer ___.' (macas)",ans:"apples"},
{type:"fill",q:"Complete: 'I ___ to go to the mall.'",ans:"prefer"},
{type:"fill",q:"Complete: 'I need to study every ___.'",ans:"week"},
{type:"fill",q:"Complete: 'Do you need to ___ now?' (dormir)",ans:"sleep"},
{type:"fill",q:"Complete: 'I like vegetables ___ much.'",ans:"very"},
{type:"fill",q:"Complete: 'I don't ___ to go.'",ans:"need"},
{type:"translate",q:"Traduza para o ingles:\n'Eu preciso ir.'",ans:"I need to go."},
{type:"translate",q:"Traduza para o ingles:\n'Eu prefiro frango.'",ans:"I prefer chicken."},
{type:"translate",q:"Traduza para o ingles:\n'Eu gosto muito de salada.'",ans:"I like salad very much."},
{type:"translate",q:"Traduza para o ingles:\n'Quando voce precisa ir a loja?'",ans:"When do you need to go to the store?"},
{type:"translate",q:"Traduza para o ingles:\n'Eu prefiro comer arroz e feijao.'",ans:"I prefer to eat rice and beans."},
{type:"translate",q:"Traduza para o ingles:\n'Eu as vezes jogo no parque.'",ans:"I sometimes play in the park."}
]}
};
var curUnit=null,curIdx=0,curScore=0,answered=false,selOpt=null,badges={};
var STRICT_CASE=['I','English','Portuguese','Spanish','French','German','Chinese'];
function stripPunct(w){return w.replace(/[.?!,;:]+$/,'');}
function answerMatch(u,a){
  u=u.trim().replace(/\s+/g,' ').replace(/[.?!]$/,'');
  a=a.trim().replace(/\s+/g,' ').replace(/[.?!]$/,'');
  var uw=u.split(' '),aw=a.split(' ');
  if(uw.length!==aw.length)return false;
  for(var i=0;i<aw.length;i++){
    var ac=stripPunct(aw[i]),uc=stripPunct(uw[i]);
    if(STRICT_CASE.indexOf(ac)!==-1){if(uc!==ac)return false;}
    else{if(uc.toLowerCase()!==ac.toLowerCase())return false;}
  }
  return true;
}
function goHome(){document.getElementById('homeScreen').classList.add('active');document.getElementById('unitContainer').innerHTML='';document.getElementById('backBtn').style.display='none';refreshBadges();}
function refreshBadges(){for(var u in badges){var el=document.getElementById('badge'+u);if(!el)continue;var s=badges[u].s,t=badges[u].t,pct=Math.round(s/t*100);el.textContent='Acertos: '+s+'/'+t+' ('+pct+'%)';el.style.color=pct===100?'#1b5e20':pct>=60?'#e65100':'#c62828';}}
function openUnit(n){curUnit=n;curIdx=0;curScore=0;answered=false;selOpt=null;document.getElementById('homeScreen').classList.remove('active');document.getElementById('backBtn').style.display='block';renderUnit();}
function renderUnit(){
  var u=UNITS[curUnit],total=u.exercises.length,pct=Math.round(curIdx/total*100);
  var vh='<div class="vocab-grid">';
  u.vocab.forEach(function(p){vh+='<div class="vocab-item"><strong>'+p[0]+'</strong> &mdash; '+p[1]+'</div>';});
  vh+='</div>';
  var h='<div class="screen active" id="uScreen"><div class="unit-hdr"><h2>Unidade '+curUnit+': '+u.title+'</h2><p>'+u.subtitle+'</p></div>'
    +'<div class="vocab-section"><h3>Vocabulario da Unidade</h3>'+vh+'</div>'
    +'<div class="prog-wrap"><div class="prog-bar" style="width:'+pct+'%"></div></div>'
    +'<div class="prog-label">Questao '+(curIdx+1)+' de '+total+'</div>'
    +'<div class="score-card" id="scoreCard"><div class="score-ring" id="scoreRing"></div><div class="score-msg" id="scoreMsg"></div><div class="score-sub" id="scoreSub"></div><br>'
    +'<button class="retry-btn" onclick="openUnit('+curUnit+')">Tentar Novamente</button>'
    +'<button class="home-btn2" onclick="goHome()">Menu Principal</button></div>';
  if(curIdx<total)h+=renderEx(u.exercises[curIdx]);
  h+='</div>';
  document.getElementById('unitContainer').innerHTML=h;
}
function renderEx(ex){
  var tags={mc:['tag-mc','Multipla Escolha'],fill:['tag-fill','Preencha a Lacuna'],translate:['tag-translate','Traducao PT to EN']};
  var cls=tags[ex.type][0],label=tags[ex.type][1];
  var h='<div class="ex-card" id="exCard"><span class="ex-type-tag '+cls+'">'+label+'</span><div class="ex-question">'+ex.q.replace(/\n/g,'<br>')+'</div>';
  if(ex.type==='mc'){
    h+='<div class="opts-grid">';
    ex.opts.forEach(function(o,i){h+='<button class="opt-btn" id="opt'+i+'" onclick="pick('+i+')">'+o+'</button>';});
    h+='</div>';
  } else if(ex.type==='fill'){
    h+='<input class="fill-input" id="fInp" type="text" placeholder="Digite sua resposta..." onkeyup="if(event.key===\'Enter\')check()">';
  } else {
    h+='<input class="fill-input" id="fInp" type="text" placeholder="Digite a traducao em ingles..." onkeyup="if(event.key===\'Enter\')check()">';
  }
  h+='<div class="btn-row"><button class="check-btn" id="checkBtn" onclick="check()">Verificar</button><button class="next-btn" id="nextBtn" onclick="advance()">Proxima</button></div><div class="feedback" id="fb"></div></div>';
  return h;
}
function pick(i){if(answered)return;selOpt=i;document.querySelectorAll('.opt-btn').forEach(function(b,j){b.classList.toggle('selected',j===i);});}
function check(){
  if(answered)return;
  var ex=UNITS[curUnit].exercises[curIdx];
  var fb=document.getElementById('fb'),cb=document.getElementById('checkBtn'),nb=document.getElementById('nextBtn');
  var ok=false;
  if(ex.type==='mc'){
    if(selOpt===null){fb.className='feedback show err';fb.textContent='Selecione uma opcao antes de verificar.';return;}
    ok=ex.opts[selOpt]===ex.ans;
    document.querySelectorAll('.opt-btn').forEach(function(b,i){b.disabled=true;if(ex.opts[i]===ex.ans)b.classList.add('correct');else if(i===selOpt&&!ok)b.classList.add('wrong');});
  } else {
    var inp=document.getElementById('fInp');
    if(!inp.value.trim()){fb.className='feedback show err';fb.textContent='Digite uma resposta antes de verificar.';return;}
    ok=answerMatch(inp.value,ex.ans);
    inp.disabled=true;inp.classList.add(ok?'correct':'wrong');
  }
  answered=true;
  if(ok){curScore++;fb.className='feedback show ok';fb.textContent='Correto! Muito bem!';}
  else{fb.className='feedback show err';fb.innerHTML='Incorreto. Resposta correta: <strong>'+ex.ans+'</strong>';}
  cb.disabled=true;nb.classList.add('show');selOpt=null;
}
function advance(){var total=UNITS[curUnit].exercises.length;curIdx++;answered=false;selOpt=null;if(curIdx>=total)showScore();else renderUnit();}
function showScore(){
  var total=UNITS[curUnit].exercises.length,pct=Math.round(curScore/total*100);
  badges[curUnit]={s:curScore,t:total};
  var pb=document.querySelector('.prog-bar');if(pb)pb.style.width='100%';
  var pl=document.querySelector('.prog-label');if(pl)pl.textContent='Unidade concluida!';
  var ec=document.getElementById('exCard');if(ec)ec.style.display='none';
  var color,msg;
  if(pct===100){color='linear-gradient(135deg,#1b5e20,#66bb6a)';msg='Perfeito! Voce dominou esta unidade!';}
  else if(pct>=80){color='linear-gradient(135deg,#2e7d32,#aed581)';msg='Muito bom! Continue assim!';}
  else if(pct>=60){color='linear-gradient(135deg,#e65100,#ffb74d)';msg='Bom trabalho! Continue praticando!';}
  else{color='linear-gradient(135deg,#b71c1c,#ef9a9a)';msg='Continue praticando! Voce vai melhorar!';}
  document.getElementById('scoreRing').style.background=color;
  document.getElementById('scoreRing').textContent=pct+'%';
  document.getElementById('scoreMsg').textContent=msg;
  document.getElementById('scoreSub').textContent='Voce acertou '+curScore+' de '+total+' questoes.';
  document.getElementById('scoreCard').classList.add('show');
  refreshBadges();
}
`
