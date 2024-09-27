const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const fileController = require("../controllers/fileController");
const folderController = require("../controllers/folderController");

router.get('/:up', async(req,res,next) =>{
    const parent = await folderController.getFolder(req,res);
    const searchParams = new URLSearchParams();
    if(parent.parent_id) searchParams.append('parent_id',parent.parent_id);
  res.redirect("/panel?" + searchParams.toString());
});

router.get("/", folderController.getDirectory);
router.post("/folder/create", folderController.createFolder);
router.post("/file/upload", upload.single("file"), fileController.uploadFile);

module.exports = router;
