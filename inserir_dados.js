const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'portal_user',
  password: 'Admin',
  database: 'portal_atividades'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado ao MySQL.');

  const sql = `
    INSERT INTO atividades (nome_aluno, curso, evento, horas, arquivo)
    VALUES ('João da Silva', 'Engenharia de Software', 'Palestra sobre Node.js', 4, 'certificado.pdf')
  `;

  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.log('Dados inseridos com sucesso! ID:', result.insertId);
    connection.end();
  });
});
