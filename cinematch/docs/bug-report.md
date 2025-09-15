# Relatório de Bug (corrigido)
**Título:** E2E falha ao avaliar cartões por strict mode do Playwright  
**Descrição:** O seletor esperava visibilidade em uma coleção; o Browser em modo estrito exige elemento único.  
**Passos:** Abrir UI e aguardar `[data-testid^="card-filme-"]`.  
**Resultado atual:** Falha de strict mode.  
**Resultado esperado:** Esperar seletor único e iterar com `nth=`.  
**Correção aplicada:** E2E ajustado para aguardar `[data-testid="filtro-genero"]` e iterar com `nth=`; mensagem de 5 filmes atualizada.
