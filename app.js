console.log('🔧 Iniciando o servidor...');
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const csvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();

// Servir arquivos estáticos da pasta Public
app.use(express.static(path.join(__dirname, 'Public')));

// Middleware para interpretar formulário e JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração do multer (upload)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Sessões (simulação de login)
app.use(session({
  secret: process.env.SESSION_SECRET || 'simulado',
  resave: false,
  saveUninitialized: true
}));

// Simular login fake
function simularLogin(req, res, next) {
  if (!req.session.user) {
    req.session.user = { id: 1, nome: 'Usuário Teste', email: 'teste@exemplo.com' };
  }
  next();
}

// Middleware de autenticação
function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/');
}

// Página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public/index.html'));
});

// Login simulado
app.get('/login', simularLogin, (req, res) => {
  res.redirect('/dashboard');
});

// Página protegida
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'Public/dashboard.html'));
});

// Upload e gravação no CSV
app.post('/enviar', upload.single('arquivo'), (req, res) => {
  const { nome, ra, evento, data, horas } = req.body;
  const arquivo = req.file;

  console.log(`Recebido: ${nome}, ${ra}, ${evento}, ${data}, ${horas}, Arquivo: ${arquivo?.filename}`);

  const csvFilePath = path.join(__dirname, 'atividades.csv');
  const writer = csvWriter({
    path: csvFilePath,
    header: [
      { id: 'nome', title: 'Nome' },
      { id: 'ra', title: 'Matrícula' }, // Alterado de 'RA' para 'Matrícula'
      { id: 'evento', title: 'Evento' },
      { id: 'data', title: 'Data' },
      { id: 'horas', title: 'Horas' },
      { id: 'arquivo', title: 'Arquivo' }
    ],
    append: true
  });

  const novaAtividade = [{
    nome,
    ra,// Alterado de 'RA' para 'Matrícula'
    evento,
    data,
    horas,
    arquivo: arquivo ? arquivo.filename : 'Nenhum'
  }];

  writer.writeRecords(novaAtividade)
    .then(() => console.log('Atividade registrada no CSV'))
    .catch(err => console.error('Erro ao salvar CSV:', err));

  res.send(`<h1>Atividade enviada com sucesso!</h1><a href="/dashboard">Voltar</a>`);
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
