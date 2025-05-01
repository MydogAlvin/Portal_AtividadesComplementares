require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const csvWriter = require('csv-writer').createObjectCsvWriter; // Para escrever CSV
const mysql = require('mysql'); // Para conexão com MySQL (comentado por enquanto)

const app = express();

// Configura arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// Middleware para capturar os dados do formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração de upload de arquivo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Pasta de destino
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nome do arquivo
  }
});

const upload = multer({ storage: storage });

// Sessão para manter login do usuário
app.use(session({
  secret: 'segredo-super-seguro',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Estratégia OAuth2 para simular login via Moodle
passport.use(new OAuth2Strategy({
    authorizationURL: `${process.env.MOODLE_BASE_URL}/admin/oauth2authorize.php`,
    tokenURL: `${process.env.MOODLE_BASE_URL}/admin/oauth2/token.php`,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, cb) {
    // Simula usuário autenticado
    const user = { id: 1, name: 'Usuário de Teste', accessToken };
    return cb(null, user);
  }
));

// Serialização do usuário na sessão
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Rota inicial (serve index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Rota para iniciar login OAuth com Moodle
app.get('/auth/moodle', passport.authenticate('oauth2'));

// Callback após login com Moodle
app.get('/auth/moodle/callback',
  passport.authenticate('oauth2', { failureRedirect: '/' }),
  (req, res) => {
    // Redireciona para página protegida após login
    res.redirect('/dashboard');
  }
);

// Middleware para proteger rotas
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

// Página protegida após login
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// Rota para receber o formulário de atividades
app.post('/enviar', upload.single('arquivo'), (req, res) => {
  // Extrai dados do formulário
  const { nome, ra, evento, data, horas } = req.body;
  const arquivo = req.file;

  console.log(`Dados recebidos:`);
  console.log(`Nome: ${nome}`);
  console.log(`RA: ${ra}`);
  console.log(`Evento: ${evento}`);
  console.log(`Data do Evento: ${data}`);
  console.log(`Horas: ${horas}`);
  console.log(`Arquivo: ${arquivo ? arquivo.filename : 'Nenhum arquivo enviado'}`);

  // Simulação de salvar no arquivo CSV
  // Caminho do arquivo CSV
  const csvFilePath = 'atividades.csv';

  const writer = csvWriter({
    path: csvFilePath,
    header: [
      { id: 'nome', title: 'Nome' },
      { id: 'ra', title: 'RA' },
      { id: 'evento', title: 'Evento' },
      { id: 'data', title: 'Data' },
      { id: 'horas', title: 'Horas' },
      { id: 'arquivo', title: 'Arquivo' }
    ]
  });

  // Caso o CSV já exista, apenas adicionamos os dados
  const newActivity = [
    {
      nome,
      ra,
      evento,
      data,
      horas,
      arquivo: arquivo ? arquivo.filename : 'Nenhum arquivo enviado'
    }
  ];

  // Gravação no CSV - comentário para evitar execução, mas pronto para usar
  /*
  writer.writeRecords(newActivity)
    .then(() => {
      console.log('Atividade salva no CSV');
    })
    .catch(err => {
      console.error('Erro ao salvar no CSV', err);
    });
  */

  // Preparação para conectar com MySQL (comentado)
  /*
  const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });

  connection.connect(err => {
    if (err) {
      console.error('Erro de conexão com o MySQL', err);
      return;
    }

    const query = 'INSERT INTO atividades (nome, ra, evento, data, horas, arquivo) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [nome, ra, evento, data, horas, arquivo ? arquivo.filename : 'Nenhum arquivo enviado'];

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error('Erro ao inserir no MySQL', err);
        return;
      }
      console.log('Atividade salva no MySQL');
    });

    connection.end();
  });
  */

  // Resposta para o frontend
  res.send(`<h1>Atividade recebida com sucesso!</h1><a href="/dashboard">Voltar</a>`);
});

// Logout
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Inicia servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
// Exporta app para testes