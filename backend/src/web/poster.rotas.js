import { Router } from 'express';
import fetch from 'node-fetch';

export const router = Router();

// Proxy simples para evitar bloqueio de hotlink e referer
router.get('/', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('url obrigatória');
  try {
    const r = await fetch(url, { redirect: 'follow' });
    if (!r.ok) return res.status(502).send('Falha ao buscar poster');
    res.setHeader('Content-Type', r.headers.get('content-type') || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    r.body.pipe(res);
  } catch (e) {
    res.status(500).send('Erro no proxy de imagem');
  }
});
