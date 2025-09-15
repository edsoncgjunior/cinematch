# language: pt
Funcionalidade: Avaliar filmes e gerar recomendações
  Para receber recomendações personalizadas
  Como um usuário do CineMatch
  Eu quero avaliar filmes e ver uma lista de 5 recomendações

  Cenário: Habilitar botão de recomendações após 5 avaliações
    Dado que acesso a página inicial
    Quando avalio 5 filmes com qualquer nota
    Então o botão "Ver Recomendações" deve estar habilitado

  Cenário: Gerar 5 recomendações respeitando a regra de distribuição
    Dado que já avaliei ao menos 5 filmes
    Quando clico em "Ver Recomendações"
    Então devo ver exatamente 5 cards na seção "Assista agora!"
    E não deve haver mais do que 3 filmes do mesmo gênero
