import { Router } from 'express';
import { body, param, query } from 'express-validator/check';
import { verifyToken, setRole, setUser } from '../controllers/v1/auth.controller';
import { checkRequestValidity } from '../middlewares/validators.middleware';
import {
  createVri, updateVri, getVris, updateVris, deleteVris, deleteVri
} from '../controllers/v1/vri.controller';

const vriRoutes = Router();

vriRoutes
  .use(verifyToken, setUser, setRole)
  .post(
    '/create',
    body('question').exists(),
    body('weight').isInt(),
    checkRequestValidity,
    createVri
  )
  .patch('/update/:uuid', param('uuid').isUUID(4), updateVri)
  .get('/fecth', getVris)
  .get('/fetch/uuid', updateVris)
  .delete('/delete', query('uuids').exists(), deleteVris)
  .delete('/delete/:uuid', deleteVri);

export default vriRoutes;
