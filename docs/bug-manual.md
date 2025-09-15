
# Bug funcional (manual)

**Título**: Erro genérico ao carregar pôster remoto indisponível  
**Cenário**: Ao abrir o catálogo com poster_url inválido, o backend retornava erro genérico e o frontend exibia mensagem pouco clara.  
**Passos**:
1. Forçar um `poster_url` inválido temporariamente.
2. Acessar `/` (catálogo).
3. Observar retorno 500 sem detalhe útil.
**Esperado**: HTTP **502**/**500** com payload `{{ erro: "...", origem: "proxy" }}`; frontend exibe aviso amigável.  
**Ajuste**: Tratamento de exceção no `poster.rotas.js` e mensagens amigáveis no `Catalogo.jsx`.  
**Severidade**: Média. **Prioridade**: Alta.
