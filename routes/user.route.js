import { Router } from 'express';
import { body, param, query } from 'express-validator/check';
import { checkRequestValidity } from '../middlewares/validators.middleware';
import { verifyToken, setRole, setUser } from '../controllers/v1/auth.controller';
import {
  registerUser,
  updateUser,
  getUser,
  getUsers,
  resetUserPassword,
  updateUserEmail,
  updateUserPhone,
  addUserVri,
  getUserVri
} from '../controllers/v1/user.controller';

const userRoutes = Router();

userRoutes
  .post(
    '/create',
    body('firstname', '3-50 letters').matches(/[A-Za-z]{3,50}/, 'g'),
    body('surname', '3-50 letters').matches(/[A-Za-z]{3,50}/, 'g'),
    body('dob', 'enter a valid integer').optional(),
    body('email').isEmail().optional(),
    body('state', '2-50 letters').matches(/[A-Za-z]{2,50}/, 'g'),
    body('phone').matches(/\d{6}/),
    body('sex').isIn(['male', 'female']).optional(),
    checkRequestValidity,
    registerUser
  )
  .use(verifyToken, setUser, setRole)
  .get(
    '/fetch',
    query('limit', 'integer >1<50').isInt({ min: 1, max: 50 }).optional(),
    query('offset', 'integer >1<50').isInt({ min: 1, max: 50 }).optional(),
    checkRequestValidity,
    getUsers
  )
  .get(
    '/fetch/:uuid',
    param('uuid').isUUID(4).optional(),
    checkRequestValidity,
    getUser
  )
  .patch(
    '/update/details/:uuid',
    param('uuid').isUUID(4),
    body('firstname', '3-50 letters').matches(/[A-Za-z]{3,50}/, 'g').optional(),
    body('surname', '3-50 letters').matches(/[A-Za-z]{3,50}/, 'g').optional(),
    body('age', 'enter a valid integer').isInt().optional(),
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
    body('phone').matches(/\d{6}/),
    checkRequestValidity,
    updateUserPhone
  )
  .post(
    '/vri',
    checkRequestValidity,
    addUserVri
  )
  .get(
    '/vri',
    checkRequestValidity,
    getUserVri
  );

export default userRoutes;
