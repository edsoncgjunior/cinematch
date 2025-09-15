import pg from 'pg'
const { Pool } = pg

const CFG = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: +(process.env.POSTGRES_PORT || 5432),
  user: process.env.POSTGRES_USER || 'cinematch',
  password: process.env.POSTGRES_PASSWORD || 'cinematch',
  database: process.env.POSTGRES_DB || 'cinematch',
}

let pool = null
let status = { ok: false, modo: 'desconhecido', erro: null }

export async function conectarComRetry(tentativas = 20, atrasoMs = 1000){
  for (let i=1; i<=tentativas; i++){
    try{
      pool = new Pool(CFG)
      await pool.query('SELECT 1')
      status = { ok: true, modo: 'postgres', erro: null }
      return pool
    }catch(e){
      status = { ok: false, modo: 'fallback-memoria', erro: e.message }
      await new Promise(r=> setTimeout(r, atrasoMs))
    }
  }
  pool = null
  return null
}

export function getPool(){ return pool }
export function getStatusDB(){ return status }
