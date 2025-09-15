import { getPool, getStatusDB } from '../db/conexao.js'

const memoria = new Map() // chave: `${usuarioId}:${filmeId}` => estrelas

export async function salvarAvaliacao({usuarioId, filmeId, estrelas}){
  const pool = getPool()
  if(pool){
    await pool.query(
      `CREATE TABLE IF NOT EXISTS avaliacoes (
         usuario_id text NOT NULL,
         filme_id integer NOT NULL,
         estrelas integer NOT NULL,
         PRIMARY KEY(usuario_id, filme_id)
       );`
    )
    await pool.query(
      'INSERT INTO avaliacoes (usuario_id, filme_id, estrelas) VALUES ($1,$2,$3) ON CONFLICT (usuario_id,filme_id) DO UPDATE SET estrelas=excluded.estrelas',
      [usuarioId, filmeId, estrelas]
    )
  } else {
    memoria.set(`${usuarioId}:${filmeId}`, estrelas)
  }
  return { ok: true }
}

export async function listarAvaliacoes(usuarioId){
  const pool = getPool()
  if(pool){
    const r = await pool.query('SELECT filme_id, estrelas FROM avaliacoes WHERE usuario_id=$1', [usuarioId])
    return r.rows.map(l=> ({filmeId: +l.filme_id, estrelas: +l.estrelas}))
  } else {
    const out = []
    for(const [k,v] of memoria){
      const [u,f] = k.split(':')
      if(u===usuarioId) out.push({filmeId:+f, estrelas:+v})
    }
    return out
  }
}

export async function deletarAvaliacoes(usuarioId){
  const pool = getPool()
  if(pool){
    await pool.query('DELETE FROM avaliacoes WHERE usuario_id=$1', [usuarioId])
  } else {
    for(const k of Array.from(memoria.keys())){
      if(k.startsWith(usuarioId+':')) memoria.delete(k)
    }
  }
  return { ok: true }
}

export function statusPersistencia(){ return getStatusDB() }
