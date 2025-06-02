const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
  res.send(`<h1>Bem-vindo ao Portal</h1><a href="/auth/moodle">Login com Moodle</a>`);
});

router.get('/auth/moodle', passport.authenticate('moodle'));

router.get('/auth/moodle/callback', 
  passport.authenticate('moodle', { failureRedirect: '/' }),
  (req, res) => {
    res.send(`<h2>Login realizado!</h2><pre>${JSON.stringify(req.user, null, 2)}</pre>`);
  }
);

module.exports = router;
// Rota de login simulado
// Rota de autorização fake
router.get('/fake/oauth/authorize', (req, res) => {
  // Redireciona diretamente ao callback com um código falso
  res.redirect(`${process.env.CALLBACK_URL}?code=fake-auth-code`);
});

// Rota de token fake
router.post('/fake/oauth/token', (req, res) => {
  res.json({
    access_token: 'fake-access-token',
    token_type: 'Bearer',
    expires_in: 3600
  });
});

// Rota de perfil de usuário fake
router.get('/fake/user', (req, res) => {
  res.json({
    id: '12345',
    name: 'Usuário Teste',
    email: 'teste@fake.com'
  });
});