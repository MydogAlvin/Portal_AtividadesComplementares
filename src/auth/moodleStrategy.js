const OAuth2Strategy = require('passport-oauth2').Strategy;
const passport = require('passport');

passport.use('moodle', new OAuth2Strategy({
  authorizationURL: process.env.AUTH_URL,
  tokenURL: process.env.TOKEN_URL,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, cb) {
  // Simula um perfil de usuário
  const fakeUser = {
    id: '12345',
    name: 'Usuário Teste',
    email: 'teste@fake.com'
  };
  return cb(null, fakeUser);
}
));
