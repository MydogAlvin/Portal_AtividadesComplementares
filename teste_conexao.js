const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'portal_user',          // ou 'root' se estiver usando o usuário padrão
  password: 'Admin',     // substitua pela senha correta
  database: 'portal_atividades' // certifique-se que esse banco existe
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar:', err.message);
    return;
  }
  console.log('✅ Conectado ao MySQL com sucesso!');
  connection.end(); // encerra a conexão após o teste
});
