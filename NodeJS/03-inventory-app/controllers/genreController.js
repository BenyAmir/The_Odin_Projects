import asyncHandler from 'express-async-handler';
import * as db from '../db/query.js';

export const GetAllGenres = asyncHandler(async(req,res)=>{
    const genres = await db.GetAllGenres();
    res.render('genres',{genres,title:'Genres'})
})

export const GetGenreById = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    const genre = await db.GetGenreById(id);
    res.render('genre-item',{genre,title:'Genres'})
})

export const InsertNewGenre = asyncHandler(async(req,res)=>{
    await db.InsertNewGenre(req.body);
    res.redirect('/genres')
})

export const UpdateGenre = asyncHandler(async(req,res)=>{
    await db.UpdateGenre(req.body);
    res.redirect('/genres')
})

export const DeleteGenre = asyncHandler(async(req,res)=>{
    if(req.headers.key != process.env.PRIVATE_KEY) {
        throw Error('you do not have permission to do that!')
}
    await db.DeleteGenre(req.params.id);
    res.json({redirect:'/genres'})
})