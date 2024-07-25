import express from 'express';
import { messages,addMessage,itemsLink } from '../controllers/main.js';

const mainRouter = express.Router();

mainRouter.get('/new',(req,res)=>res.render('form'));
mainRouter.post('/new',(req,res)=>{
    console.log(req.body);
    addMessage(req.body);
    res.redirect('/')
});

mainRouter.get('/item/:id',(req,res)=>{
    const {id} = req.params;
    res.render('item',{item:messages[id]});
})

mainRouter.get('/',(req,res,next)=>{
    res.render('index',{ title: "Mini Messageboard", messages: messages,itemsLink });
});

export default mainRouter;