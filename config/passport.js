import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';

const {
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  API_URL
} = process.env;

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

passport.use(new TwitterStrategy(
  {
    session: false,
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    includeEmail: true,
    callbackURL: `${API_URL}/api/v1/auth/twitter/callback`
  },
  (token, tokenSecret, profile, cb) => cb(null, profile)
));

export default passport;
