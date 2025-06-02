console.log('🔧 Iniciando o servidor...');

// 1. IMPORTAÇÕES
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const csvParser = require('csv-parser');

// 2. CONFIGURAÇÃO INICIAL DO APP
const app = express();
const PORT = process.env.PORT || 3000;

// 3. MIDDLEWARE
app.use(express.static(path.join(__dirname, 'Public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'));
  }
});
const upload = multer({ storage: storage });

app.use(session({
  secret: process.env.SESSION_SECRET || 'chave-secreta-simulada',
  resave: false,
  saveUninitialized: true
}));

function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/');
}

// 4. ROTAS DA APLICAÇÃO
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public/index.html'));
});

app.get('/login', (req, res) => {
  if (!req.session.user) {
    req.session.user = { id: 1, nome: 'Usuário de Teste Simulado' };
  }
  res.redirect('/portal-aluno');
});

app.get('/portal-aluno', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'Public/portal-aluno.html'));
});

app.get('/enviar-atividade.html', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'Public/enviar-atividade.html'));
});

// Rota de TESTE para lidar com o envio do formulário
app.post('/enviar', ensureAuthenticated, upload.single('arquivo'), (req, res) => {
    // Log inicial para garantir que a rota foi acionada
    console.log('--- ROTA /enviar FOI ACIONADA! ---');

    // Log para ver o conteúdo dos campos de texto
    console.log('Conteúdo de req.body (campos do formulário):');
    console.log(req.body);

    // Log para ver as informações do arquivo enviado
    console.log('Conteúdo de req.file (informações do arquivo):');
    console.log(req.file);

    // Resposta visual no navegador para confirmar o recebimento
    if (req.body && Object.keys(req.body).length > 0) {
        const fileInfo = req.file ? `Arquivo recebido: ${req.file.filename}` : 'Nenhum arquivo recebido.';
        res.send(`<h1>Debug: Dados Recebidos!</h1>
                  <h2>Verifique o terminal do VS Code para detalhes.</h2>
                  <p><b>Conteúdo do formulário:</b> ${JSON.stringify(req.body)}</p>
                  <p><b>Informação do arquivo:</b> ${fileInfo}</p>
                  <a href="/portal-aluno">Voltar ao Portal</a>`);
    } else {
        res.status(400).send(`<h1>ERRO: O servidor recebeu a requisição, mas o corpo (req.body) está vazio.</h1>
                              <h2>Isso pode ser um problema com o middleware. Verifique a ordem no server.js.</h2>
                              <a href="/enviar-atividade.html">Tentar Novamente</a>`);
    }
});

app.get('/api/atividades', ensureAuthenticated, (req, res) => {
  const results = [];
  const csvFilePath = path.join(__dirname, 'atividades.csv');

  if (!fs.existsSync(csvFilePath)) {
    return res.json([]);
  }
  
  fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json(results.reverse());
    })
    .on('error', (error) => {
        console.error('Erro ao ler CSV:', error);
        res.status(500).json({ error: 'Erro ao ler os dados das atividades.' });
    });
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao destruir a sessão:', err);
      return res.status(500).send('Erro ao fazer logout.');
    }
    res.redirect('/');
  });
});

// 5. INICIALIZAÇÃO DO SERVIDOR (COM VERIFICAÇÃO DE ERROS)
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ ERRO FATAL: A porta ${PORT} já está em uso.`);
    console.error('Verifique se você não tem outro terminal com um servidor rodando ou feche o programa que está usando esta porta.');
  } else {
    console.error('❌ Ocorreu um erro ao iniciar o servidor:', err);
  }
  process.exit(1);
});