import { Router } from 'express';
import { query } from 'express-validator/check';
import { checkRequestValidity } from '../middlewares/validators.middleware';
import { getNews, getImages } from '../controllers/v1/news.controller';

const newsRoutes = Router();

newsRoutes
  .get(
    '/news',
    getNews
  )
  .get(
    '/images',
    query('media_id'),
    checkRequestValidity,
    getImages
  );

export default newsRoutes;
