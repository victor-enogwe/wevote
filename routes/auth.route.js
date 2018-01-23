import { Router } from 'express';
import { body, oneOf } from 'express-validator/check';
import { checkRequestValidity } from '../middlewares/validators.middleware';
import passport from '../config/passport';
import { basicAuth, facebookAuth } from '../controllers/v1/auth.controller';

const authRoutes = Router();

authRoutes
  .post(
    '/basic',
    oneOf([body('email').isEmail(), body('phone').matches(/0\d{10}/)]),
    body('password', 'min of 8 chars').isLength({ min: 8 }),
    checkRequestValidity,
    basicAuth
  )
  .get('/facebook', passport.authenticate('facebook'))
  .get('/facebook/callback', facebookAuth);

export default authRoutes;
