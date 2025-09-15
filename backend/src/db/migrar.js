import { consultar, pool } from './conexao.js';

async function migrar() {
  await consultar(`
    CREATE TABLE IF NOT EXISTS avaliacoes (
      usuario_id VARCHAR(80) NOT NULL,
      filme_id INT NOT NULL,
      estrelas INT NOT NULL CHECK (estrelas BETWEEN 1 AND 5),
      PRIMARY KEY (usuario_id, filme_id)
    );
  `);
  await pool.end();
  console.log('Migração concluída.');
}

migrar().catch(e => {
  console.error('Falha na migração', e);
  process.exit(1);
});
