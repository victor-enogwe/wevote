import FacebookStrategy from 'passport-facebook'
import passport from 'passport'
import { User } from '../models'

const {
  FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, HOST_NAME
} = process.env

passport.use(new FacebookStrategy({
  callbackURL: `${HOST_NAME}/api/v1/auth/facebook/callback`,
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  profileFields: ['id', 'displayName', 'picture', 'email'],
  scope: ['email', 'public_profile'],
  session: false
}, async (...args) => {
  const [data, cb] = args.slice(2)

  try {
    const { id } = data
    const { doc: user } = await User.findOrCreate({ socialId: id }, {
      ...data
    })

    return cb(null, user)
  } catch (error) {
    return cb(error.message, null)
  }
}))

passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((user, cb) => cb(null, user))

export default passport
