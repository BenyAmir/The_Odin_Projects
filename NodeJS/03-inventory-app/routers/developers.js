import express from 'express';
import * as controllers from '../controllers/developerController.js';

const developerRouter = express.Router();

developerRouter.get('/',controllers.GetAllDevelopers);
developerRouter.post('/add',controllers.InsertNewDeveloper);
developerRouter.get('/:id',controllers.GetDeveloperById);
developerRouter.delete('/:id/delete',controllers.DeleteDeveloper);
developerRouter.post('/:id/update',controllers.UpdateDeveloper);


export default developerRouter;