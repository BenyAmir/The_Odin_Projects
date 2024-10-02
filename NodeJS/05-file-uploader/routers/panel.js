const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const uploader = require("../middlewares/cloudinary");
const fileController = require("../controllers/fileController");
const folderController = require("../controllers/folderController");

router.get("/", folderController.getDirectory);
router.post("/folder/create", folderController.createFolder);
router.get("/folder/:id/delete", folderController.deleteFolder);
router.post("/folder/:id/update", folderController.updateFolder);
router.post("/folder/:id/file/upload", upload.single("file"), fileController.uploadFile);
router.get("/folder/:id/file/:fileID/delete", fileController.deleteFile);
router.post("/folder/:id/file/:fileID/update", fileController.updateFile);
router.get("/folder/:id/file/:fileID", fileController.showFile);
router.get("/file/:id/download", fileController.downloadFile);

module.exports = router;
