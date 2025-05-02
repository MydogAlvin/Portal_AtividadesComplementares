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

  const sql = 'SELECT * FROM atividades';

  connection.query(sql, (err, results) => {
    if (err) throw err;
    console.log('Atividades registradas:');
    console.table(results);
    connection.end();
  });
});
