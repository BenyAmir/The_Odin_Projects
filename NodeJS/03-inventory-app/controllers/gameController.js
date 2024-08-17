import asyncHandler from 'express-async-handler';
import * as db from '../db/query.js';

export const GetAllGames = asyncHandler(async(req,res)=>{
    const games = await db.GetAllGames();
    const genres = await db.GetAllGenres();
    res.render('games',{games,genres,title:'Games'})
})

export const GetGameById = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    const genres = await db.GetAllGenres();
    const developers = await db.GetAllDevelopers();
    const directors = await db.GetCreatorByGame(id);
    const game = await db.GetGameById(id);
    res.render('game-item',{game,genres,developers, directors,title:'Games'})
})

export const InsertNewGame = asyncHandler(async(req,res)=>{
    await db.InsertNewGame(req.body);
    res.redirect('/games')
})

export const UpdateGame = asyncHandler(async(req,res)=>{
    await db.UpdateGame(req.body);
    res.redirect('/games')
})

export const DeleteGame = asyncHandler(async(req,res)=>{
    if(req.headers.key != process.env.PRIVATE_KEY) {
        throw Error('you do not have permission to do that!')
}
    await db.DeleteGame(req.params.id);
    res.json({redirect:'/games'})
})
