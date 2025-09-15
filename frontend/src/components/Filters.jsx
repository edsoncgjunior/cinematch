import React from 'react';

export default function Filters({
  busca, setBusca,
  genero, setGenero,
  ano, setAno,
  generos = [], anos = []
}) {
  return (
    <div className="panel" data-testid="filtro-genero">
      <h3>Filtros</h3>
      <div className="filters">
        <div>
          <label className="small" htmlFor="filtro-busca">Buscar Título</label>
          <input
            id="filtro-busca"
            data-testid="filtro-busca"
            className="input"
            placeholder="Digite o título do filme"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <div>
          <label className="small" htmlFor="filtro-genero-select">Gênero</label>
          <select
            id="filtro-genero-select"
            data-testid="filtro-genero-select"
            className="select"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          >
            <option value="">Todos os Gêneros</option>
            {generos.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="small" htmlFor="filtro-ano">Ano</label>
          <select
            id="filtro-ano"
            data-testid="filtro-ano"
            className="select"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
          >
            <option value="">Todos os Anos</option>
            {anos.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
