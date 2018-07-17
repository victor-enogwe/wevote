import { Router } from 'express'
import passport from '../middlewares/passport.middleware'
import { assignRole, generateJwt } from '../controllers/auth.controller'
const auth = Router()

auth.get('/facebook', passport.authenticate('facebook'))
  .get('/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/login?error=true'
  }), assignRole, generateJwt)

export default auth
