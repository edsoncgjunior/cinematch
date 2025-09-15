import { gerarRecomendacoes } from "../src/servicos/Recomendador.js";

const f=(id,nome,genero,ano,nota)=>({id,nome,genero,ano,nota,poster_url:""});

test("RN003 - não recomenda filmes já avaliados e respeita máx 3 por gênero", ()=>{
  const filmes=[
    f(1,"A","Ação",2010,4.9),
    f(2,"B","Ação",2011,4.8),
    f(3,"C","Ação",2012,4.7),
    f(4,"D","Ação",2013,4.6), // 4º de Ação
    f(5,"E","Drama",2010,4.9),
    f(6,"F","Drama",2011,4.7),
    f(7,"G","Comédia",2012,4.9),
  ]
  const avaliacoes=[
    {filmeId:5, estrelas:5}, // Drama +2
    {filmeId:6, estrelas:4}, // Drama +1 (preferido)
  ]
  const recs = gerarRecomendacoes({filmes, avaliacoes})
  // Não pode conter filme 5 ou 6 (avaliados)
  const ids = new Set(recs.map(r=> r.id))
  expect(ids.has(5)).toBe(false)
  expect(ids.has(6)).toBe(false)
  // Máximo 3 por gênero
  const counts = recs.reduce((m,x)=> (m[x.genero]=(m[x.genero]||0)+1, m), {})
  expect(Math.max(...Object.values(counts))).toBeLessThanOrEqual(3)
})