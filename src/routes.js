import { Router } from 'express';

import {
  UserController,
  SessionController,
  StudentController,
  PlanController,
  EnrollmentController,
  CheckinController,
  HelpOrdersController,
} from './app/controllers';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.post('/students/:id/checkins', CheckinController.store);
routes.get('/students/:id/checkins', CheckinController.index);

routes.post('/students/:id/help-orders', HelpOrdersController.store);
routes.get('/students/:id/help-orders', HelpOrdersController.index);

routes.use(authMiddleware);

routes.get('/users', UserController.index);
routes.put('/users', UserController.update);

routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);

routes.get('/enrollment', EnrollmentController.index);
routes.post('/enrollment', EnrollmentController.store);
routes.put('/enrollment/:id', EnrollmentController.update);
routes.delete('/enrollment/:id', EnrollmentController.delete);

routes.put('/help-orders/:id/answer', HelpOrdersController.update);

export default routes;
