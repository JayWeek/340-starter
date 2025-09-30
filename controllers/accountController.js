const util = require("../utilities/index")
const accountModel = require("../models/account-modal")
const { validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */

async function buildLogin(req, res, next) {
    let nav = await util.getNav()
    res.render("account/login", {
        title : "Login",
        errors: [],
        nav,
    })
}

async function buildRegistration(req, res, next) {
    let nav = await util.getNav()
    res.render("account/registration", { //views > account > registration.ejs
        title: "Register",
        nav,
        errors : null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await util.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.")
    return res.status(500).render("account/registration", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    return res.status(501).render("account/registration", {
      title: "Registration",
      nav,
      errors,
    })
  }
}


/* ****************************************
*  Process Login
* *************************************** */

async function loginAccount(req, res) {
  let nav = await util.getNav()
  const errors = validationResult(req)

  // If validator errors
  if (!errors.isEmpty()) {
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors, // ✅ pass the full validationResult
      account_email: req.body.account_email,
    })
  }

  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: { array: () => [{ msg: "Email not found." }] }, // ✅ mimic validationResult
      account_email,
    })
  }

  const passwordMatch = await bcrypt.compare(account_password, accountData.account_password)
  if (!passwordMatch) {
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: { array: () => [{ msg: "Incorrect password." }] }, // ✅ mimic validationResult
      account_email,
    })
  }

  // success
  req.session.account = {
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_email: accountData.account_email,
  }
  req.flash("notice", `Welcome back, ${accountData.account_firstname}`)
  res.redirect("/account/dashboard")
}


module.exports = {buildLogin, buildRegistration, registerAccount, loginAccount}