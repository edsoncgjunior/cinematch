import express from 'express'
import cors from 'cors'
import { conectarComRetry, getStatusDB } from './db/conexao.js'
import { router as filmesRotas } from './web/filmes.rotas.js'
import { router as avaliacoesRotas } from './web/avaliacoes.rotas.js'
import { router as recomendacoesRotas } from './web/recomendacoes.rotas.js'
import { router as posterRotas } from './web/poster.rotas.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res)=> res.json({ status: 'ok', db: getStatusDB() }))

app.use('/api/filmes', filmesRotas)
app.use('/api/avaliacoes', avaliacoesRotas)
app.use('/api/recomendacoes', recomendacoesRotas)
app.use('/api/poster', posterRotas)

app.use((err, _req, res, _next)=>{
  console.error('Erro:', err)
  res.status(err.status || 500).json({ erro: err.message || 'Erro interno' })
})

const PORTA = process.env.PORT || 3000

conectarComRetry().finally(()=>{
  app.listen(PORTA, ()=> console.log('API rodando na porta', PORTA, 'modo DB:', getStatusDB().modo))
})
