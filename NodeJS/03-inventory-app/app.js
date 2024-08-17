import 'dotenv/config';
import express from 'express';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import gameRouter from './routers/games.js';
import genreRouter from './routers/genres.js';
import developerRouter from './routers/developers.js';
import * as db from './db/query.js';
import asyncHandler from 'express-async-handler';

const PORT = process.env.PORT ?? 3000;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.set('views',join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static(join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));

app.use('/games',gameRouter);
app.use('/genres',genreRouter);
app.use('/developers',developerRouter);
app.get('/',asyncHandler(async(req,res)=>{
    const data = await db.GetAllCreators();
    const games = await db.GetAllGames();
    res.render('index',{title:'Game Inventory Management',games,data})
}))

app.use((err,req,res,next)=>{
    console.log('errpr:',err);
    res.status(500).json({message:err.message})
})

app.listen(PORT,()=>console.log(`express is listening on ${PORT}`))