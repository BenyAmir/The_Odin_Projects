const {join} = require('node:path');
const express = require('express');
const expressSession = require('express-session');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const authRouter = require('./routers/auth.js');
require("./config/passport");

const app = express();

app.set('views',join(__dirname,'views'));
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(join(__dirname,'public')));

app.use(
    expressSession({
      cookie: {
       maxAge: 7 * 24 * 60 * 60 * 1000 // ms
      },
      secret: 'a santa at nasa',
      resave: true,
      saveUninitialized: true,
      store: new PrismaSessionStore(
        new PrismaClient(),
        {
          checkPeriod: 2 * 60 * 1000,  //ms
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        }
      )
    })
  );

  app.use(passport.session());

  app.use((req,res,next)=>{
    res.locals.errors = req.session.messages;
    delete req.session.messages;
    res.locals.user = req.user;
    next();
  })


  app.get('/',(req,res)=>{
    res.render('index')
  });
  app.use('/auth',authRouter);
  app.use((req,res,next)=>{
    if (req.isAuthenticated()) {
      next()
    } else {
      res.send("<h1>You are not authenticated</h1>");
    }
  })

  app.use('/panel',(req,res,next)=>{
    res.render('panel')
  })

  app.use((err, req, res, next) => {
    return res.status(500).json({ message: err.message });
  });

  app.listen('3000',()=>{
    console.log("app is listening on port 3000 !!")
  })