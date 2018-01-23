import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';
import swaggerConfig from '../config/swagger/swagger';
import customCss from '../config/swagger/swagger.css';

const docRoutes = Router();

docRoutes.use(swaggerUi.serve)
  .get('/', swaggerUi.setup(swaggerConfig, {
    explorer: true,
    customSiteTitle: 'We Vote Api',
    customCss
  }));

export default docRoutes;
