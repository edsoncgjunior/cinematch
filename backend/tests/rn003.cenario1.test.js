import { gerarRecomendacoes } from '../src/servicos/Recomendador.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function carregarFilmes(){
  const arquivo = path.join(__dirname, '../src/dados/cinematch_movies.json')
  const bruto = JSON.parse(fs.readFileSync(arquivo,'utf-8'))
  return Array.isArray(bruto) ? bruto : bruto.filmes
}

function idPorNome(filmes, nome){
  const f = filmes.find(x=> x.nome === nome)
  if(!f) throw new Error('Filme não encontrado no dataset: '+nome)
  return f.id
}

test('RN003 - Cenário de teste 1 do enunciado', ()=>{
  const filmes = carregarFilmes()

  const avaliacoes = [
    ['A Origem',5], // +2 Sci-Fi
    ['Matrix',4],   // +1 Sci-Fi
    ['Blade Runner 2049',3], // +0 Sci-Fi
    ['O Poderoso Chefão',2], // -1 Drama
    ['A Lista de Schindler',1], // -2 Drama
    ['Batman: O Cavaleiro das Trevas',5], // +2 Ação
    ['Mad Max: Estrada da Fúria',4], // +1 Ação
    ['Corra!',2], // -1 Terror
    ['A Viagem de Chihiro',2], // -1 Terror (usando título do dataset)
  ].map(([nome, estrelas])=> ({ filmeId: idPorNome(filmes, nome), estrelas }))

  const rec = gerarRecomendacoes({filmes, avaliacoes}).map(f=> f.nome)

  expect(rec.slice(0,5)).toEqual([
    'Interestelar',
    'Gladiador',
    'Duro de Matar',
    'A Chegada',
    'Os Vingadores',
  ])
})