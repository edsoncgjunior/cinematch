import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let _cache = null

function localizarJSON(){
  const candidatos = [
    // comum em projetos
    path.join(__dirname, 'cinematch_movies.json'),
    path.join(__dirname, 'cinematch_filmes.json'),
    // raiz do app / docker
    '/app/cinematch_movies.json',
    '/app/backend/cinematch_movies.json',
    '/app/backend/src/dados/cinematch_movies.json',
    '/app/backend/src/dados/cinematch_filmes.json',
    // caminhos relativos
    path.join(process.cwd(), 'cinematch_movies.json'),
    path.join(process.cwd(), 'backend', 'src', 'dados', 'cinematch_movies.json'),
    path.join(process.cwd(), 'backend', 'src', 'dados', 'cinematch_filmes.json')
  ]
  for(const p of candidatos){
    try{
      if(fs.existsSync(p)) return p
    }catch{}
  }
  return null
}

function normalizarFilme(f){
  // tenta mapear campos comuns
  const id = f.id ?? f.ID ?? f.codigo ?? f.code
  const nome = f.nome ?? f.titulo ?? f.title ?? ''
  const genero = f.genero ?? f.genero_principal ?? f.genre ?? f.generoPrincipal ?? 'Desconhecido'
  const ano = +(f.ano ?? f.lancamento ?? f.year ?? f.releaseYear ?? 0)
  const nota = +(f.nota ?? f.rating ?? f.nota_global ?? f.imdb ?? 0)
  const poster_url = f.poster_url ?? f.poster ?? f.imagem ?? f.image ?? ''
  return { id, nome, genero, ano, nota, poster_url }
}

function carregar(){
  if(_cache) return _cache
  const arquivo = localizarJSON()
  if(!arquivo) throw new Error('Arquivo cinematch_movies.json não encontrado.')
  const bruto = JSON.parse(fs.readFileSync(arquivo, 'utf-8'))
  const filmes = Array.isArray(bruto) ? bruto.map(normalizarFilme)
                : Array.isArray(bruto.filmes) ? bruto.filmes.map(normalizarFilme)
                : []
  const generos = Array.from(new Set(filmes.map(f=> f.genero))).sort((a,b)=> a.localeCompare(b))
  const anos = Array.from(new Set(filmes.map(f=> f.ano))).filter(Boolean).sort((a,b)=> b-a)
  _cache = { filmes, generos, anos }
  return _cache
}

export async function listarFilmes({ busca='', genero='Todos os Gêneros', ano='Todos os Anos' } = {}){
  const { filmes, generos, anos } = carregar()
  const b = (busca||'').trim().toLowerCase()
  const fil = filmes.filter(f=> {
    const okBusca = b ? (f.nome||'').toLowerCase().includes(b) : true
    const okGenero = (genero === 'Todos os Gêneros') ? true : f.genero === genero
    const okAno = (ano === 'Todos os Anos') ? true : (String(f.ano) === String(ano))
    return okBusca && okGenero && okAno
  })
  // ordenação estável por nome e depois id
  fil.sort((a,b)=> (a.nome||'').localeCompare(b.nome||'') || (a.id - b.id))
  return { filmes: fil, generos, anos }
}
