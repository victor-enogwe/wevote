import { Router } from 'express';
import { body, param, query } from 'express-validator/check';
import {
  verifyToken, setRole, setUser, isAdminOrSuperUser
} from '../controllers/v1/auth.controller';
import { checkRequestValidity } from '../middlewares/validators.middleware';
import {
  createNotification, updateNotification, getNotifications, deleteNotifications, deleteNotification, sendNotification
} from '../controllers/v1/Notification.controller';

const notificationRoutes = Router();

notificationRoutes
  .get(
    '/fetch',
    query('limit', 'integer >1<50').isInt({ min: 1, max: 50 }).optional(),
    query('offset', 'integer >1<50').isInt({ min: 1, max: 50 }).optional(),
    checkRequestValidity,
    getNotifications
  )
  .use(verifyToken, setUser, setRole, isAdminOrSuperUser)
  .post(
    '/create',
    body('code').exists(),
    body('group').exists(),
    body('message').exists(),
    checkRequestValidity,
    createNotification
  )
  .post(
    '/send',
    body('message').exists(),
    checkRequestValidity,
    sendNotification
  )
  .patch('/update/:id', param('id').isInt(), updateNotification)
  .delete('/delete', query('ids').exists(), deleteNotifications)
  .delete('/delete/:id', param('id').isInt(), deleteNotification);

export default notificationRoutes;
