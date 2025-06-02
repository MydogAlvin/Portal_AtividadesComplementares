const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Portal de Atividades</title>
      </head>
      <body>
        <h1>Bem-vindo ao Portal de Atividades</h1>
        <a href="/auth/moodle">
          <button>Login com Moodle</button>
        </a>
      </body>
    </html>
  `);
});