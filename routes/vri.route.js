import { Router } from 'express';
import { body, param, query } from 'express-validator/check';
import {
  verifyToken, setRole, setUser, isAdminOrSuperUser
} from '../controllers/v1/auth.controller';
import { checkRequestValidity } from '../middlewares/validators.middleware';
import {
  createVri, updateVri, getVris, updateVris, deleteVris, deleteVri
} from '../controllers/v1/vri.controller';

const vriRoutes = Router();

vriRoutes
  .get(
    '/fetch',
    query('limit', 'integer >1<50').isInt({ min: 1, max: 50 }).optional(),
    query('offset', 'integer >1<50').isInt({ min: 1, max: 50 }).optional(),
    checkRequestValidity,
    getVris
  )
  .get(
    '/fetch/:id',
    param('id').isInt(),
    checkRequestValidity,
    updateVris
  )
  .use(verifyToken, setUser, setRole, isAdminOrSuperUser)
  .post(
    '/create',
    body('question').exists(),
    body('weight').isInt(),
    checkRequestValidity,
    createVri
  )
  .patch('/update/:id', param('id').isInt(), updateVri)
  .delete('/delete', query('ids').exists(), deleteVris)
  .delete('/delete/:id', param('id').isInt(), deleteVri);

export default vriRoutes;
