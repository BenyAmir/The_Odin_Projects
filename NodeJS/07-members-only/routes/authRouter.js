const {Router} = require('express');
const authController = require('../controllers/authController');
const authRouter = Router();

authRouter.get('/signup',(req,res)=>res.render('signup'));
authRouter.post('/signup',authController.signup);

authRouter.get('/login',authController.getLogin);
authRouter.post('/login',authController.postLogin);

authRouter.post('/logout',authController.logout);


module.exports = authRouter;