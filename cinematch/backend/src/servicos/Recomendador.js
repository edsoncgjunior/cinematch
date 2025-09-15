/**
 * RN003 completa — CineMatch
 * - Score_Final = Score_Genero*0.7 + Nota*0.3
 * - Máx. 3 por gênero
 * - 5º item: prioriza gênero neutro; se não houver, pega o próximo melhor mas **preferindo classe** (preferido > neutro > rejeitado)
 * - Desempate: maior Nota; depois menor id
 * - Casos especiais: indisponíveis; todos rejeitados; todos avaliados (RN003.7)
 */
import { CalculadoraAfinidade } from './CalculadoraAfinidade.js'

const P_G = 0.7
const P_N = 0.3

const clone = v => JSON.parse(JSON.stringify(v))

function byNotaThenId(a,b){
  if ((b.nota||0)!==(a.nota||0)) return (b.nota||0)-(a.nota||0)
  return (a.id||0)-(b.id||0)
}
function byScoreFinal(a,b){
  if (b.scoreFinal!==a.scoreFinal) return b.scoreFinal-a.scoreFinal
  return byNotaThenId(a,b)
}
function classOf(score){ return score>0?2:(score<0?0:1) } // 2 preferido, 1 neutro, 0 rejeitado

function escolherGeneroPreferidoParaExtra(filmes, scorePorGenero){
  const preferidos = [...scorePorGenero.entries()].filter(([g,s])=> s>0).map(([g])=> g)
  if (preferidos.length===0) return null
  const rows = preferidos.map(g=>{
    const lista = filmes.filter(f=> f.genero===g)
    const maxNota = Math.max(...lista.map(f=> +f.nota||0))
    const minId   = Math.min(...lista.map(f=> +f.id||0))
    return {g, maxNota, minId}
  }).sort((a,b)=> (b.maxNota-a.maxNota) || (a.minId-b.minId))
  return rows[0].g
}

function recomendarTodosAvaliados(filmes, scorePorGenero){
  const gPref = escolherGeneroPreferidoParaExtra(filmes, scorePorGenero)
  if (gPref){
    return filmes.filter(f=> f.genero===gPref).sort(byNotaThenId).slice(0,5)
  }
  return [...filmes].sort(byNotaThenId).slice(0,5)
}

function recomendarParcial({filmes, avaliacoes, scorePorGenero}){
  const avaliados = new Set(avaliacoes.map(a=> +a.filmeId))
  const generosCatalogo = Array.from(new Set(filmes.map(f=> f.genero)))
  const todosRejeitados = generosCatalogo.length>0 && generosCatalogo.every(g=> (scorePorGenero.get(g)||0) < 0)

  let candidatos = filmes.filter(f=> !avaliados.has(+f.id)).map(f=>{
    const sg = scorePorGenero.get(f.genero) ?? 0
    const nota = +f.nota || 0
    const scoreFinal = todosRejeitados ? nota : (sg*P_G + nota*P_N)
    return { ...clone(f), scoreFinal, _sg: sg, _class: classOf(sg) }
  })

  if (!todosRejeitados){
    candidatos.sort((a,b)=> (b._class - a._class) || byScoreFinal(a,b))
  } else {
    candidatos.sort(byScoreFinal)
  }

  if (candidatos.length===0) return {recomendados:[], motivo:'Todos avaliados'}

  // Seleciona primeiros 4 respeitando máx 3 por gênero
  const porGenero = new Map()
  const lista = []
  for (const f of candidatos){
    const c = porGenero.get(f.genero) || 0
    if (c>=3) continue
    lista.push(f)
    porGenero.set(f.genero, c+1)
    if (lista.length===4) break
  }

  // 5º: prioriza neutro; se não houver, escolhe o próximo melhor **preferindo classe** e respeitando máx 3
  if (lista.length<5){
    const usados = new Set(lista.map(x=> x.id))
    const neutros = candidatos.filter(f=> !usados.has(f.id) && classOf(scorePorGenero.get(f.genero)||0)===1 && (porGenero.get(f.genero)||0)<3)
    if (neutros.length>0){
      lista.push(neutros[0])
    } else {
      const rem = candidatos.filter(f=> !usados.has(f.id) && (porGenero.get(f.genero)||0)<3)
      rem.sort((a,b)=> (b._class - a._class) || byScoreFinal(a,b))
      if (rem.length>0) lista.push(rem[0])
    }
  }

  // Completa até 5 se faltar (mantendo máx 3 por gênero)
  while (lista.length<5){
    const usados = new Set(lista.map(x=> x.id))
    const rem = candidatos.filter(f=> !usados.has(f.id) && (porGenero.get(f.genero)||0)<3)
    if (rem.length===0) break
    lista.push(rem[0])
    porGenero.set(rem[0].genero, (porGenero.get(rem[0].genero)||0)+1)
  }

  // Safety: garantir que nenhum avaliado escapou
  const final = lista.filter(f=> !avaliados.has(+f.id)).slice(0,5)
  return {recomendados: final, motivo:'Parcial'}
}

export function gerarRecomendacoes({filmes=[], avaliacoes=[]}={}){
  const calc = new CalculadoraAfinidade()
  const scorePorGenero = calc.scoreGeneros(filmes, avaliacoes)
  const total = filmes.length
  const avalSet = new Set(avaliacoes.map(a=> +a.filmeId))

  if (total>0 && avalSet.size>=total){
    return recomendarTodosAvaliados(filmes, scorePorGenero)
  }

  const {recomendados} = recomendarParcial({filmes, avaliacoes, scorePorGenero})
  return recomendados
}

export class Recomendador{
  constructor({filmes=[]}={}){ this.filmes = filmes }
  recomendar({avaliacoes=[]}={}){ return gerarRecomendacoes({filmes:this.filmes, avaliacoes}) }
}
