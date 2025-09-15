
# CineMatch — Estudo de Caso

> **Status**: 100% dos requisitos atendidos (funcionais e não funcionais), incluindo diferenciais (HTTP adequado, testes de API com Robot, SonarQube).  
> **Stack**: Node/Express + React (Vite) + PostgreSQL + Docker + Robot Framework (API/E2E) + Jest (unit) + k6 (bonus - performance simples).

## 1. Arquitetura & Pastas
```
cinematch/
  backend/
    src/
      dados/ (dataset oficial: cinematch_movies.json)
      db/
      servicos/ (Recomendador.js com RN003.* completa)
      web/ (rotas REST)
    tests/ (Jest unit - RN003 cenários oficiais)
  frontend/
    src/
      components/ (MovieCard/Filters/BottomBar com data-testid)
      pages/ (Catálogo e Recomendações)
  tests/
    robot/
      api/ (tests de API)
      e2e/ (fluxo UI completo)
    performance/k6/ (smoke/carga)
  .github/workflows/ci.yml
```

## 2. Como Executar (Docker)

### Subir ambiente
```bash
docker compose up -d --build db backend frontend
```

### Rodar **Unit** (Jest) — isolado
```bash
docker compose run --rm backend npm test
```

### Rodar **API (Robot)** — isolado
```bash
docker compose --profile tests run --rm test_api
```

### Rodar **E2E (Robot)** — isolado
```bash
docker compose --profile tests run --rm test_e2e
```

### Rodar **Performance (k6)** — isolado
```bash
docker compose --profile tests run --rm test_perf
```

### Pipeline CI (GitHub Actions)
Arquivo: `.github/workflows/ci.yml` — build, unit, Robot API, Robot E2E e k6, e teardown.

## 3. Decisões & Padrões
- **RN003 implementada exatamente**: pesos 0.7/0.3; limite de 3 por gênero; 5º item neutro prioritário; desempate por nota e depois id; casos especiais; RN003.7 para “todos avaliados”.
- **HTTP adequado**: 200/201/400/500 conforme cenário.
- **Tratamento de erros no frontend** com mensagens amigáveis e `aria-*`.
- **Testabilidade**: `data-testid` nos elementos críticos e funções puras no serviço.

## 4. Plano de Testes (versões e links)
Documento versionado: **`docs/plano-de-testes.md`**  
Especificações Gherkin: **`tests/gherkin/*.feature`**

## 5. Especificações em Gherkin
Ver `tests/gherkin/avaliar_filmes.feature` (cobertura de avaliação e recomendação mínima).

## 6. Qualidade do Código / Revisão
### Itens de melhoria (curto prazo)
- Reduzir acoplamento entre camadas com interfaces explícitas no repositório (injeção de dependência no serviço de recomendação).
- Aumentar logging estruturado (padrão JSON) e correlação de requisições.
- Adicionar cache com TTL para `/filmes` (catálogo estático) evitando reprocessamentos.

## 7. Usabilidade
- Botão **“Ver Recomendações”** só habilita após **≥5** avaliações (`aria-disabled` e prevenção de click).

## 8. Relatos exigidos
- **Bug funcional manual** (`docs/bug-manual.md`): poster remoto indisponível retornava erro genérico — ajuste feito para retornar 502/500 e mensagem clara no frontend.
- **Requisitos não atendidos**: **nenhum**. Todos os itens do enunciado foram atendidos.

## 9. SonarQube (Diferencial)
Executar localmente:
```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:community
# Após subir, configure o token e rode sonar-scanner no backend e frontend (ver docs/sonar.md)
```
Relatório e principais prioridades documentados em **`docs/sonar.md`**.

## 10. Endpoints principais
- `GET /api/filmes?busca=&genero=&ano=`
- `POST /api/avaliacoes` { usuarioId, filmeId, estrelas }
- `DELETE /api/avaliacoes?usuarioId=`
- `GET /api/recomendacoes?usuarioId=`
- `GET /api/poster?url=`

---

### Como validar rapidamente
1. Avalie 5 filmes pela UI → botão habilita.  
2. Veja 5 recomendações → nenhum é avaliado, máx 3 por gênero, e RN003.7 quando tudo está avaliado.  
3. `npm test` no backend → **passa os dois cenários oficiais do enunciado**.
