import { Router } from 'express'
import { listarFilmes } from '../dados/FilmesRepositorio.js'

export const router = Router()

// GET /api/filmes?busca=&genero=&ano=
router.get('/', async (req, res, next) => {
  try {
    const { busca='', genero='Todos os Gêneros', ano='Todos os Anos' } = req.query
    const r = await listarFilmes({ busca, genero, ano })
    res.json(r)
  } catch (e) { next(e) }
})
