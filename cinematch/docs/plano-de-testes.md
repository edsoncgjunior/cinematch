# Plano de Testes – CineMatch

## Escopo
- Backend (algoritmo RN003, API)
- Frontend (UI/UX, feedback de erro, habilitação de botão)
- Integração (persistência e regras)
- E2E (fluxos chave)
- Smoke/Perf (k6)

## Estratégia (curto prazo)
1) **Unitários (Jest)**: lógica RN003 (afinidade, pesos, desempate, distribuição, casos especiais, RN003.7).
2) **API (Robot Requests)**: status HTTP corretos (RQNF4), mensagens de erro e contratos.
3) **E2E (Robot Browser)**: fluxo avaliar≥5 → recomendar; valida 5 itens e máx. 3 por gênero.
4) **Smoke/Perf (k6)**: GET/POST essenciais; erro 0% e latências estáveis.

## Prioridades
P1: RN003 correta (unitários e E2E)  
P2: Tratamento de erros e status HTTP (API)  
P3: Usabilidade e feedback de UI

## Cobertura de Caixa Branca / Preta (RQNF14)
- **Caixa branca**: funções de cálculo (scores, desempate, distribuição e casos especiais) — via Jest.
- **Caixa preta**: API + UI (entrada/saída, comportamento visível ao usuário) — via Robot.

## Categorias executadas (RQNF15)
- Unitários, Integração (API), E2E, Smoke, Regressão básica.

## Artefatos
- Unitários: `backend/tests/*.test.js`
- API Robot: `tests/robot/api/*`
- E2E Robot: `tests/robot/e2e/*`
- Perf: `tests/perf/*`
