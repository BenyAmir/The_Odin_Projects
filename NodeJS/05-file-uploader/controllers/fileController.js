const prisma = require("../prisma/client");
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const folderController = require('./folderController');
const fs = require('node:fs');

exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).render('message',{ message: "No File Uploaded!" });
  }

  try {
    const { filename,originalname,path } = req.file;
    let directoryId = req.params.id;
    if(!directoryId){
      const root = await folderController.getRoot();
      directoryId = root.id;
    }
    const name = Buffer.from(originalname, 'latin1').toString('utf8');
     await prisma.file.create({
      data: {
        displayName:name,
        name:filename,
        folder_id: directoryId,
        path
      },
    });

    res.status(201).render('message',{message:'the file has been uploaded successfully'});
  } catch (error) {
    if (error instanceof multer.MulterError) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    return res.status(400).render('message',{message:error.message});
  }
};

exports.deleteFile = async(req,res) => {
  try {
    let {fileID,id:directoryId} = req.params;
    if(!directoryId){
      const root = await folderController.getRoot();
      directoryId = root.id;
    }
    const file = await prisma.file.delete({
      where:{
        id:fileID,
        folder_id:directoryId
      }
    })
    await cloudinary.uploader.destroy(file.name, function(error,result) {
      console.log(result, error);
      if(error) throw error
    }) 

    res.redirect(`/panel?parent_id=${directoryId}`);
  } catch (error) {
    res.status(400).render('message',error.message)
  }
}

exports.updateFile = async(req,res) => {
  try {
    const {name} = req.body;
    let {fileID,id:directoryId} = req.params;
    if(!directoryId){
      const root = await folderController.getRoot();
      directoryId = root.id;
    }
    await prisma.file.update({
      where:{
        id:fileID,
        folder_id:directoryId
      },
      data:{
        name
      }
    })

    res.redirect(`/panel?parent_id=${directoryId}`);
  } catch (error) {
    res.status(400).render('message',error.message)
  }
}

exports.showFile = async(req,res) => {
  try {
    let {fileID,id:directoryId} = req.params;
    
    const file = await prisma.file.findFirst({where:{
      id:fileID,
      folder_id:directoryId
    }})

    res.render(`file`,{file});
  } catch (error) {
    res.status(400).render('message',error.message)
  }
}

exports.downloadFile = async(req,res) => {
  try {
    let {id} = req.params;

    const file = await prisma.file.findFirst({
      where:{
        id
      }
    })
    
    const fileStream = fs.createReadStream(file.path);
    res.setHeader('Content-Disposition', 'attachment: filename="' + file.name + '"')
    fileStream.pipe(res)

  } catch (error) {
    res.status(400).render('message',error.message)
  }
}

