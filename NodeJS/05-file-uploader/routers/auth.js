const express = require('express');
const controller = require('../controllers/authController.js');

const router = express.Router();


router.post('/register',controller.signup);
router.post('/login',(req,res,next)=>{
    res.locals.authRequest = 'login';
    controller.login(req,res,next)
}
);

router.get('/logout',controller.logout)


module.exports = router