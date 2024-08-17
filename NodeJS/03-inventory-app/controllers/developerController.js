import asyncHandler from 'express-async-handler';
import * as db from '../db/query.js';

export const GetAllDevelopers = asyncHandler(async(req,res)=>{
    const developers = await db.GetAllDevelopers();
    const games = await db.GetAllGames();
    res.render('developers',{developers,games,title:'Developers'})
})

export const GetDeveloperById = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    const developer = await db.GetDeveloperById(id);
    const games = await db.GetAllGames();
    const developedGames = await db.GetCreatorByDeveloper(id);
    res.render('developer-item',{developer,games,developedGames,title:'Developers'})
})

export const InsertNewDeveloper = asyncHandler(async(req,res)=>{
    const insertedData = await db.InsertNewDeveloper(req.body);
    const {developer_id} = insertedData.rows[0];
    await db.InsertCreator({game_id:req.body.game_id,developer_id});
    res.redirect('/developers')
})

export const UpdateDeveloper = asyncHandler(async(req,res)=>{
    await db.UpdateDeveloper(req.body);
    res.redirect('/developers')
})

export const DeleteDeveloper = asyncHandler(async(req,res)=>{
    if(req.headers.key != process.env.PRIVATE_KEY) {
            throw Error('you do not have permission to do that!')
    }
    await db.DeleteDeveloper(req.params.id);
    res.json({redirect:'/developers'})
})