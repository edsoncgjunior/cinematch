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

test('RN003 - Cenário de teste 2 do enunciado', ()=>{
  const filmes = carregarFilmes()

  const avaliacoes = [
    ['Batman: O Cavaleiro das Trevas',1],
    ['Mad Max: Estrada da Fúria',1],
    ['Corra!',1],
    ['Um Lugar Silencioso',1],
    ['Toy Story',1],
    ['A Viagem de Chihiro',1],
    ['O Poderoso Chefão',1],
    ['A Lista de Schindler',1],
  ].map(([nome, estrelas])=> ({ filmeId: idPorNome(filmes, nome), estrelas }))

  const rec = gerarRecomendacoes({filmes, avaliacoes}).map(f=> f.nome)

  expect(rec.slice(0,5)).toEqual([
    'A Origem',
    'Matrix',
    'Interestelar',
    'Um Sonho de Liberdade',
    'Parasita',
  ])
})