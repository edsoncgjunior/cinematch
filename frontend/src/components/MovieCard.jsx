import React from 'react'
const API='/api'
function Star({filled,onClick,tid}){
  return <button type="button" className={'star'+(filled?'':' inactive')} onClick={onClick} data-testid={tid} aria-label="estrela">★</button>
}
export default function MovieCard({filme,avaliacao=0,onRate}){
  const poster=filme?.poster_url?`${API}/poster?url=${encodeURIComponent(filme.poster_url)}`:null
  const estrelas=[1,2,3,4,5]
  return (<div className="card" data-testid={`card-filme-${filme.id}`} data-id={filme.id} data-genero={filme.genero}>
    <div className="poster">{poster?<img src={poster} alt={filme.nome}/>:<span>sem poster</span>}</div>
    <div className="card-body">
      <div className="title" data-testid="card-titulo">{filme.nome}</div>
      <div className="meta" data-testid="card-meta">{filme.genero}, {filme.ano}</div>
      <div className="stars" role="group" aria-label="Avaliar" data-testid={`card-estrelas-${filme.id}`}>
        {estrelas.map(n=>
          <Star key={n}
            tid={`btn-estrela-${filme.id}-${n}`}
            filled={n<=(avaliacao||0)}
            onClick={()=>onRate&&onRate(filme,n)}
          />
        )}
        {avaliacao?<span className="small" style={{marginLeft:6,color:'#16a34a'}}>Você deu {avaliacao}★</span>:<span className="small" style={{marginLeft:6,color:'#64748b'}}>Avalie</span>}
      </div>
    </div>
  </div>)
}