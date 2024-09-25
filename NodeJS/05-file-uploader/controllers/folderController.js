const prisma = require('../prisma/client');

exports.getDirectory = async(req,res) =>{
    const {parent_id} = req.query;
    return await prisma.folder.findMany({where:{
        parent_id: parent_id || null
    }});
}
exports.getFolder = async(req,res) =>{
    const {parent_id} = req.query;

    return await prisma.folder.findUnique({where:{
        id:parent_id
    }});;
}

exports.createFolder = async(req,res) =>{
    try {        
        const {name,parent_id} = req.body;
        
        await prisma.folder.create({
            data:{
                name,
                parent_id:parent_id || null
            }
        })
        
    } catch (error) {
        res.locals.errors = error
    } finally{
        res.redirect('/panel');
    }
}

exports.backToParentDirectory = async(req,res) => {
    const {parent_id:id} = req.params;
    const folder = prisma.folder.findUnique({where:{
        id: id
    }});

    const upLevelParentId = folder.parent_id;
    return await prisma.folder.findUnique({where:{
        parent_id: upLevelParentId
    }});
}