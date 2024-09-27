const prisma = require("../prisma/client");
const multer = require('multer');

exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).render('message',{ message: "No File Uploaded!" });
  }

  try {
    const { filename,originalname } = req.file;
    const {parent_id} = req.body;
    const name = Buffer.from(originalname, 'latin1').toString('utf8');
     await prisma.file.create({
      data: {
        name,
        folder_id: parent_id || null
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
