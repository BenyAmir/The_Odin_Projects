import express from 'express';
import ejs from 'ejs';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
import mainRouter from './routes/main.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ?? 5000;

const app = express();
app.set('views',join(__dirname,'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}));
app.use("/",mainRouter);
app.use(express.static(join(__dirname,'public')));

app.use((err,req,res,next)=>{
    res.status(500).send(err)
})

// app.engine('ejs',ejs.__express);

app.listen(PORT,()=>console.log(`Listening on Port ${PORT}`));