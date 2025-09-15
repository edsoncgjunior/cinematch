
# SonarQube — Relatório & Prioridades

## Como rodar
1. `docker run -d --name sonarqube -p 9000:9000 sonarqube:community`
2. Gerar token no Sonar e configurar `SONAR_TOKEN` localmente.
3. Rodar scanner no backend e frontend (exemplos de `sonar-project.properties` não incluídos para manter foco).

## Achados típicos e prioridades
- **Duplicações baixas**: OK.
- **Complexidade cognitiva**: atenção em `Recomendador.js` — mantido modular com helpers para legibilidade.
- **Linhas não cobertas**: testes unit abrangem RN003; aumentar casos negativos (inputs inválidos) no futuro.
- **Segurança**: validar URLs de poster — já há proxy com validação simples.

**Ajustes de maior benefício/baixo risco**:
1. Extrair validadores de request em middlewares.
2. Adicionar ESLint/Prettier no CI.
3. Cobrir mais cenários de erros em rotas.
