const express = require("express")
const router = express.Router()
const util = require("../utilities/")
const accController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

router.get("/login", util.handleErrors(accController.buildLogin))
router.get("/register", util.handleErrors(accController.buildRegistration))
router.post("/register",
    regValidate.registrationRules(), //but this does
    regValidate.checkRegData, //why doesn't this have ()
     util.handleErrors(accController.registerAccount))

router.post("/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  util.handleErrors(accController.loginAccount)
)
module.exports = router