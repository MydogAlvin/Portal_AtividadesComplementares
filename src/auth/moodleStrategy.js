const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const axios = require('axios');

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use('moodle', new OAuth2Strategy({
  authorizationURL: process.env.MOODLE_AUTH_URL,
  tokenURL: process.env.MOODLE_TOKEN_URL,
  clientID: process.env.MOODLE_CLIENT_ID,
  clientSecret: process.env.MOODLE_CLIENT_SECRET,
  callbackURL: process.env.MOODLE_CALLBACK_URL
},
async function (accessToken, refreshToken, profile, done) {
  try {
    const res = await axios.get(`${process.env.MOODLE_USERINFO_URL}?wstoken=${accessToken}&wsfunction=core_webservice_get_site_info&moodlewsrestformat=json`);
    const user = res.data;
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));
