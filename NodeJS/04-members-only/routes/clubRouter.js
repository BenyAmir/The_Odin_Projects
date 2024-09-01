const {Router} = require('express');
const clubController = require('../controllers/clubController');
const clubRouter = Router();

clubRouter.get('/',clubController.getJoin);
clubRouter.post('/',clubController.joinClub);

module.exports = clubRouter;