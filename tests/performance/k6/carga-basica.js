import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  vus: 10,
  duration: '30s'
}

const API = __ENV.K6_API || 'http://backend:3000/api'

export default function () {
  let r = http.get(`${API}/filmes?busca=&genero=Todos%20os%20G%C3%AAneros&ano=Todos%20os%20Anos`)
  check(r, { 'filmes 200': (res) => res.status === 200 })

  // Recomenda para usuário fixo após avaliações simuladas
  r = http.get(`${API}/recomendacoes?usuarioId=edson`)
  check(r, { 'recs 200': (res) => res.status === 200 })
  sleep(1)
}
