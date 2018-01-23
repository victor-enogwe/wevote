import { Router } from 'express';
import { query } from 'express-validator/check';
import { checkRequestValidity } from '../middlewares/validators.middleware';
import { sendVerificationEmail, verifyEmail } from '../controllers/v1/email.controller';

const emailRoutes = Router();

emailRoutes
  .get('/send-verification', query('email').isEmail(), checkRequestValidity, sendVerificationEmail)
  .get('/verify', query('code').exists(), checkRequestValidity, verifyEmail);

export default emailRoutes;
