const {body, validationResult} = require("express-validator")
const validate = {}
const utilities = require("../utilities/index")

// Sanitize the form first after value is receieved from form

validate.addClassificationRules = () =>{
    return [
        body("classification_name")
        .trim()
        .isLength({min:3})
        .withMessage("Classification name must be atleast 3 characters")
        .isLength({max:30})
        .withMessage("Classification name must be 30 characters or fewer.")
        .matches(/^[A-Za-z0-9\s]+$/)
        .withMessage("Use only letters, numbers and spaces.")
    ]
}

validate.checkAddClasificationData = async function(req, res, next){
   
    // Collect the submitted data
    const classification_name = req.body.classification_name
    // check server-side validation result from express validator middleware
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // Build nav so the view renders normally, and return errors to view
        let nav = await utilities.getNav()
         res.render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: errors.array(), //convert to array for EJS
            classification_name, // send back the user input for sticky behaviour (nice UX)
        })
        return //prevents the data from moving into the controller.
    }
    next() //move into controller
}


/* ================================
   Validation Rules for Add Inventory
================================ */
validate.addInventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Make is required.")
      .isLength({ max: 50 })
      .withMessage("Make must be 50 characters or fewer."),

    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Model is required.")
      .isLength({ max: 50 })
      .withMessage("Model must be 50 characters or fewer."),

    body("inv_year")
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Year must be a valid 4-digit year between 1900 and 2100."),

    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Description is required."),

    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Thumbnail path is required."),

    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a non-negative number."),

    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Color is required.")
      .isLength({ max: 20 })
      .withMessage("Color must be 20 characters or fewer."),

    body("classification_id")
      .isInt({ min: 1 })
      .withMessage("You must select a classification.")
  ]
}

validate.checkAddInventoryData = async function (req, res, next) {
  const errors = validationResult(req) //returns an object

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    // rebuild dropdown with sticky selected value
    const classificationSelect = await utilities.buildClassificationList(req.body.classification_id)

    return res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classifications: classificationSelect,
      errors: errors.array(), //converts to array for EJS
      ...req.body   // spread form data so sticky fields work
    })
  }
  next()
}


module.exports = validate