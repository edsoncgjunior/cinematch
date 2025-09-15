import { Recomendador } from "../src/servicos/Recomendador.js";

const f=(id,nome,genero,ano,nota)=>({id,nome,genero,ano,nota,poster_url:""});

test("RN003.7 - quando TODOS os filmes estão avaliados, recomenda top-5 do gênero preferido", ()=>{
  // 6 filmes, 3 de Drama, 3 de Comédia
  const filmes=[
    f(1,"A","Drama",2010,4.6),
    f(2,"B","Drama",2011,4.8),
    f(3,"C","Drama",2012,4.7),
    f(4,"D","Comédia",2010,4.9),
    f(5,"E","Comédia",2011,4.2),
    f(6,"F","Comédia",2013,4.5),
  ]
  // Avaliações: Comédia muito negativa (-2,-2,-2) => rejeitado; Drama positiva (4★=+1,5★=+2)
  const avaliacoes=[
    {filmeId:4, estrelas:1}, // Comédia -2
    {filmeId:5, estrelas:1}, // Comédia -2
    {filmeId:6, estrelas:1}, // Comédia -2
    {filmeId:1, estrelas:4}, // Drama +1
    {filmeId:2, estrelas:5}, // Drama +2
    {filmeId:3, estrelas:3}, // Drama  0
  ]
  const r = new Recomendador({filmes});
  const lista = r.recomendar({avaliacoes});
  // RN003.7: gênero preferido = Drama; ordenar por nota dentro do gênero
  expect(lista.map(x=>x.nome)).toEqual(["B","C","A"]); // só 3 existem, mas a regra é atendida
})