const prisma = require("../prisma/client");
const multer = require('multer');

exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).render('message',{ message: "No File Uploaded!" });
  }

  try {
    const { filename } = req.file;
     await prisma.file.create({
      data: {
        name: filename,
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
