import { Router } from 'express';
import { ussd } from '../controllers/v1/ussd.controller';

const ussdRoutes = Router();

ussdRoutes
  .post(
    '/send',
    ussd
  ).get(
    '/send',
    ussd
  );

export default ussdRoutes;
