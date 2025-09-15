import { Router } from 'express'
import { listarAvaliacoes } from '../dados/AvaliacaoRepositorio.js'
import { listarFilmes } from '../dados/FilmesRepositorio.js'
import { gerarRecomendacoes } from '../servicos/Recomendador.js'

export const router = Router()

// GET /api/recomendacoes?usuarioId=edson
router.get('/', async (req, res, next) => {
  try {
    const { usuarioId } = req.query
    if(!usuarioId) return res.status(400).json({erro:'usuarioId é obrigatório'})
    const avaliacoes = await listarAvaliacoes(usuarioId)
    const filmes = await listarFilmes({})
    const recomendacoes = gerarRecomendacoes({ filmes: filmes.filmes || filmes, avaliacoes })
    res.json({ recomendacoes })
  } catch (e) { next(e) }
})
