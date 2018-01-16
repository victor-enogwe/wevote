import { Router } from 'express';
import { body } from 'express-validator/check';
import { checkRequestValidity } from '../middlewares/validators.middleware';
import {
  basicAuth
} from '../controllers/v1/auth.controller';

const authRoutes = Router();

authRoutes
  .post(
    '/basic',
    body('email').isEmail(),
    body('password', 'min of 8 chars').isLength({ min: 8 }),
    checkRequestValidity,
    basicAuth
  );

export default authRoutes;
