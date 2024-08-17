import express from 'express';
import * as controllers from '../controllers/genreController.js';

const genreRouter = express.Router();

genreRouter.get('/',controllers.GetAllGenres);
genreRouter.post('/add',controllers.InsertNewGenre);
genreRouter.get('/:id',controllers.GetGenreById);
genreRouter.post('/:id/update',controllers.UpdateGenre);
genreRouter.post('/:id/delete',controllers.DeleteGenre);

export default genreRouter;