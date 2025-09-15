import React, { useEffect, useMemo, useState } from 'react';
import Filters from '../components/Filters.jsx';
import MovieCard from '../components/MovieCard.jsx';
import Pagination from '../components/Pagination.jsx';
import BottomBar from '../components/BottomBar.jsx';
import { apiGet, apiPost, apiDelete, getUsuarioId } from '../utils/api.js';

export default function Catalogo() {
  const [busca, setBusca] = useState('');
  const [genero, setGenero] = useState(''); // vazio = Todos os Gêneros
  const [ano, setAno] = useState(''); // vazio = Todos os Anos

  const [generos, setGeneros] = useState([]);
  const [anos, setAnos] = useState([]);

  const [filmes, setFilmes] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const [page, setPage] = useState(1);
  const pageSize = 12;
  const usuarioId = getUsuarioId();

  async function carregarFilmes() {
    setCarregando(true);
    setErro('');
    try {
      const params = {};
      if (busca && busca.trim()) params.busca = busca.trim();
      if (genero) params.genero = genero;
      if (ano) params.ano = ano;

      const data = await apiGet('/filmes', params);
      const lista = Array.isArray(data) ? data : (data?.filmes ?? []);

      // popula combos somente com valores reais
      const setG = new Set(lista.map(f => f.genero).filter(Boolean));
      setGeneros(Array.from(setG).sort());

      const setA = new Set(lista.map(f => f.ano).filter(Boolean));
      setAnos(Array.from(setA).sort((a,b)=>String(a).localeCompare(String(b))));

      setFilmes(lista);
    } catch (e) {
      console.error(e);
      setErro('Falha ao carregar filmes');
    } finally {
      setCarregando(false);
    }
  }

  async function carregarAvaliacoes() {
    try {
      const data = await apiGet('/avaliacoes', { usuarioId });
      const map = {};
      (Array.isArray(data) ? data : data?.avaliacoes ?? []).forEach(a => {
        map[a.filmeId] = a.estrelas;
      });
      setAvaliacoes(map);
    } catch (e) {
      console.warn('Sem avaliações ainda');
    }
  }

  useEffect(() => { carregarFilmes(); carregarAvaliacoes(); }, []);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); carregarFilmes(); }, 150);
    return () => clearTimeout(t);
  }, [busca, genero, ano]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filmes.slice(start, start + pageSize);
  }, [filmes, page]);

  async function onRate(filme, estrelas) {
    try {
      const filmeId = filme.id ?? filme.filmeId;
      await apiPost('/avaliacoes', { usuarioId, filmeId, estrelas });
      setAvaliacoes(prev => ({ ...prev, [filmeId]: estrelas }));
    } catch (e) {
      console.error(e);
      alert('Não foi possível salvar a avaliação.');
    }
  }

  async function onClear() {
    if (!confirm('Deseja realmente desfazer todas as avaliações?')) return;
    try {
      await apiDelete('/avaliacoes', { usuarioId });
      setAvaliacoes({});
    } catch (e) {
      console.error(e);
      alert('Falha ao desfazer avaliações.');
    }
  }

  return (
    <div>
      <div className="h1">Encontre seu Próximo Filme</div>
      <div className="subtitle">Procure por filmes e receba recomendações baseadas nas suas avaliações.</div>
      <Filters
        busca={busca} setBusca={setBusca}
        genero={genero} setGenero={setGenero}
        ano={ano} setAno={setAno}
        generos={generos} anos={anos}
      />
      <div className="section-title">Catálogo de Filmes</div>
      {erro && <div className="panel" style={{ borderColor: '#7f1d1d', color: '#fecaca' }}>⚠ {erro}</div>}
      {carregando && <div className="panel">Carregando...</div>}
      <div className="grid">
        {pageItems.map(f => {
          const key = f.id ?? f.filmeId;
          return (
            <MovieCard key={key} filme={f} avaliacao={avaliacoes[key] || 0} onRate={onRate} />
          );
        })}
      </div>
      <Pagination page={page} setPage={setPage} total={filmes.length} pageSize={pageSize} />
      <BottomBar totalAvaliacoes={Object.keys(avaliacoes).length} onClear={onClear} />
    </div>
  );
}
