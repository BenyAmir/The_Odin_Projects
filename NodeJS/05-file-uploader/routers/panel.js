const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const fileController = require("../controllers/fileController");
const folderController = require("../controllers/folderController");

router.get("/", folderController.getDirectory);
router.post("/folder/create", folderController.createFolder);
router.get("/folder/:id/delete", folderController.deleteFolder);
router.post("/folder/:id/update", folderController.updateFolder);
router.post("/file/upload", upload.single("file"), fileController.uploadFile);

module.exports = router;
