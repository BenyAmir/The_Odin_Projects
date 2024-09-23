const express = require('express');
const {login,signup} = require('../controllers/authController.js');

const router = express.Router();


router.post('/register',signup);
router.post('/login',(req,res,next)=>{
    res.locals.authRequest = 'login';
    login(req,res,next)
}
);


module.exports = router