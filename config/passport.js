import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';

const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, API_URL } = process.env;

passport.use(new FacebookStrategy(
  {
    session: false,
    scope: ['email', 'user_about_me'],
    profileFields: ['id', 'displayName', 'photos', 'email'],
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: `${API_URL}/api/v1/auth/facebook/callback`
  },
  (accessToken, refreshToken, profile, cb) => cb(null, profile)
));

export default passport;
