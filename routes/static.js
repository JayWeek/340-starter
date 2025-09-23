const express = require('express');
const errorCont = require('../controllers/errorController')
const util = require('../utilities/index')
const router = express.Router();

// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static("public"));
router.use("/css", express.static(__dirname + "public/css"));
router.use("/js", express.static(__dirname + "public/js"));
router.use("/images", express.static(__dirname + "public/images"));
router.get("/trigger-error", util.handleErrors(errorCont.triggerError))

module.exports = router;



