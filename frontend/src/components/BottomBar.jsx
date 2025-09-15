import React from 'react'
import { Link } from 'react-router-dom'
export default function BottomBar({totalAvaliacoes=0,onClear}){
  const habilitado = (totalAvaliacoes >= 5)
  return (<div className="bottom-bar">
    <div className="small">
      Selecione e avalie pelo menos 5 filmes para receber recomendações personalizadas. <span className="badge-counter" data-testid="contador-avaliacoes">{totalAvaliacoes} avaliados</span>
    </div>
    <div className="actions">
      <button className="btn secondary" onClick={onClear} data-testid="btn-desfazer-avaliacoes">Desfazer avaliações</button>
      <Link
        data-testid="btn-ver-recomendacoes"
        className={"btn" + (habilitado ? "" : " disabled")}
        to={habilitado ? "/recomendacoes" : "#"}
        aria-disabled={!habilitado}
        onClick={(e)=> { if(!habilitado){ e.preventDefault(); e.stopPropagation(); } }}
      >
        Ver Recomendações
      </Link>
    </div>
  </div>)
}