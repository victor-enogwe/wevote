import { Router } from 'express';
import { body, param, query } from 'express-validator/check';
import { checkRequestValidity } from '../middlewares/validators.middleware';
import { verifyToken } from '../controllers/v1/auth.controller';
import {
  createUser,
  updateUser,
  getUser,
  getUsers,
  resetUserPassword,
  updateUserEmail,
  updateUserPhone
} from '../controllers/v1/user.controller';

const userRoutes = Router();

userRoutes
  .post(
    '/create',
    body('firstname', '3-50 letters').matches(/[A-Za-z]{3,50}/, 'g'),
    body('surname', '3-50 letters').matches(/[A-Za-z]{3,50}/, 'g'),
    body('email').isEmail(),
    body('password', 'min of 8 chars').isLength({ min: 8 }),
    body('phone').matches(/0\d{10}/).optional(),
    checkRequestValidity,
    createUser
  )
  .use(verifyToken)
  .get(
    '/fetch',
    query('limit', 'integer >1<50').isInt({ min: 1, max: 50 }).optional(),
    query('offset', 'integer >1<50').isInt({ min: 1, max: 50 }).optional(),
    checkRequestValidity,
    getUsers
  )
  .get(
    '/:uuid',
    param('uuid').isUUID(4).optional(),
    checkRequestValidity,
    getUser
  )
  .patch(
    '/update/details/:uuid',
    param('uuid').isUUID(4),
    body('firstname', '3-50 letters').matches(/[A-Za-z]{3,50}/, 'g').optional(),
    body('surname', '3-50 letters').matches(/[A-Za-z]{3,50}/, 'g').optional(),
    checkRequestValidity,
    updateUser
  )
  .patch(
    '/reset/password',
    body('oldPassword', 'min of 8 chars').isLength({ min: 8 }).optional(),
    body('newPassword', 'min of 8 chars').isLength({ min: 8 }).optional(),
    checkRequestValidity,
    resetUserPassword
  )
  .patch(
    '/update/email',
    body('email').isEmail(),
    checkRequestValidity,
    updateUserEmail
  )
  .patch(
    '/update/phone',
    body('phone').matches(/0\d{10}/),
    checkRequestValidity,
    updateUserPhone
  );

export default userRoutes;
