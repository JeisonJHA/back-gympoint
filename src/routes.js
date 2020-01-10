import { Router } from 'express';

import {
  UserController,
  SessionController,
  StudentController,
} from './app/controllers';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);

export default routes;
