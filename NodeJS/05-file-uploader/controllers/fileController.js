const prisma = require("../prisma/client");

exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No File Uploaded!" });
  }

  try {
    const { filename } = req.file;
     await prisma.file.create({
      data: {
        name: filename,
      },
    });

    res.status(201).render('upload');
  } catch (error) {
    if (error instanceof multer.MulterError) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    return res.status(400).json({message:error.message});
  }
};
