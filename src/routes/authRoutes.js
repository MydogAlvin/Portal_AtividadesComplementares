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
