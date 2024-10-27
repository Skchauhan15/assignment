const verifyToken = require("../../middlewares/authJwt");
const controller = require("./upload.controller");

const express = require("express");
const router = express.Router();

router.post("/upload_file",verifyToken, controller.uploadFiles);
router.get("/list_file", controller.listFiles);

module.exports = router;
