import { Router } from 'express';
import { body } from 'express-validator/check';
import { checkRequestValidity } from '../middlewares/validators.middleware';
import passport from '../config/passport';
import { basicAuth, confirm, facebookAuth, twitterAuth } from '../controllers/v1/auth.controller';

const authRoutes = Router();

authRoutes
  .post(
    '/basic',
    body('phone').matches(/0\d{10}/),
    body('surname').matches(/^[A-Za-z][A-Za-z]{2,39}$/),
    checkRequestValidity,
    basicAuth
  )
  .post(
    '/confirm',
    body('phone').matches(/0\d{10}/),
    checkRequestValidity,
    confirm
  )
  .get('/facebook', passport.authenticate('facebook'))
  .get('/facebook/callback', facebookAuth)
  .get('/twitter', passport.authenticate('twitter'))
  .get('/twitter/callback', twitterAuth);

export default authRoutes;
