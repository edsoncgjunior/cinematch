export class CalculadoraAfinidade {
  constructor(){
    this.mapaPontuacao = {1:-2, 2:-1, 3:0, 4:1, 5:2};
  }

  scoreGeneros(filmes, avaliacoes){
    // Soma por gênero com base nas avaliações
    const porGenero = new Map();
    for(const av of avaliacoes){
      const filme = filmes.find(f=> f.id === Number(av.filmeId));
      if(!filme) continue;
      const pontos = this.mapaPontuacao[av.estrelas] ?? 0;
      porGenero.set(filme.genero, (porGenero.get(filme.genero) || 0) + pontos);
    }
    return porGenero; // Map<genero, score>
  }

  classificarGenero(score){
    if(score > 0) return 'preferido';
    if(score < 0) return 'rejeitado';
    return 'neutro';
  }
}
