import { Router } from 'express'
import { salvarAvaliacao, listarAvaliacoes, deletarAvaliacoes } from '../dados/AvaliacaoRepositorio.js'
export const router = Router()
router.get('/', async (req,res,next)=>{try{const {usuarioId}=req.query;if(!usuarioId)return res.status(400).json({erro:'usuarioId é obrigatório'});const avaliacoes=await listarAvaliacoes(usuarioId);res.json({avaliacoes})}catch(e){next(e)}})
router.post('/', async (req,res,next)=>{try{const {usuarioId,filmeId,estrelas}=req.body||{};if(!usuarioId||!filmeId||!estrelas){return res.status(400).json({erro:'usuarioId, filmeId e estrelas são obrigatórios'})}await salvarAvaliacao({usuarioId,filmeId,estrelas});res.status(201).json({ok:true})}catch(e){next(e)}})
router.delete('/', async (req,res,next)=>{try{const {usuarioId}=req.query;if(!usuarioId)return res.status(400).json({erro:'usuarioId é obrigatório'});await deletarAvaliacoes(usuarioId);res.json({ok:true})}catch(e){next(e)}})
