import React,{useEffect,useState} from 'react'
import { Link } from 'react-router-dom'
import MovieCard from '../components/MovieCard.jsx'
import {apiGet,getUsuarioId} from '../utils/api.js'
export default function Recomendacoes(){
  const [lista,setLista]=useState([])
  const [erro,setErro]=useState('')
  const [carregando,setCarregando]=useState(false)
  const usuarioId=getUsuarioId()
  async function carregar(){
    setErro('');setCarregando(true)
    try{
      const data=await apiGet('/recomendacoes',{usuarioId})
      setLista(data.recomendacoes||[])
    }catch(e){
      setErro('Não foi possível carregar recomendações')
      console.error(e)
    }finally{setCarregando(false)}
  }
  useEffect(()=>{carregar()},[])
  return (<div data-testid="pagina-recomendacoes">
    <div className="h1">Assista agora!</div>
    <div className="subtitle">Filmes recomendados baseados nas suas avaliações.</div>
    {erro&&<div className="panel" style={{borderColor:'#7f1d1d',color:'#fecaca'}}>⚠ {erro}</div>}
    {carregando&&<div className="panel">Carregando...</div>}
    <div className="grid" style={{gridTemplateColumns:'repeat(5, minmax(0, 1fr))', gap: '12px'}} data-testid="grid-recomendacoes">
      {lista.map(f => <div key={f.id||f.nome} data-testid="reco-card"><MovieCard filme={f} avaliacao={0} /></div>)}
    </div>
    <div style={{marginTop:16}}><Link className="btn ghost" to="/">◀ Voltar</Link></div>
  </div>)
}