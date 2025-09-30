const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  let nav = await utilities.getNav()

  if (!data || data.length === 0) {
    // Query classification name separately
    const classInfo = await invModel.getClassificationById(classification_id)
    const className = classInfo ? classInfo.classification_name : "Unknown"
    req.flash("notice", `No vehicles found under ${className}.`)
    return res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid: "<p class='notice'>No vehicles available for this classification yet.</p>"
    })
  }

  const grid = await utilities.buildClassificationGrid(data)
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


invCont.buildByInvId = async function (req, res) {
  const inv_id = req.params.inv_id
  const vehicleData = await invModel.getVehicleById(inv_id)
  const vehicleDetails = await utilities.buildVehicleDetail(vehicleData)
  const nav = await utilities.getNav()
  res.render("./inventory/detail", {
    title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
    nav,
    content: vehicleDetails
  })
}

invCont.buildManagement = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("./inventory/management", {
    title : "Inventory Management",
    nav,
  })
}

invCont.buildAddClassification = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title : "Add Classification",
    nav,
    errors: null,
  })
}


/* ***************************
 *  Process Add Classification
 * ************************** */
invCont.addClassification = async function(req, res) {
  const nav = await utilities.getNav()
  // get value from form
  const {classification_name} = req.body
  // insert value to database
  const addResult = await invModel.addClassification(classification_name)

  if (addResult) {
    req.flash(
      "notice",
      `Classification ${classification_name} added successfully.`
    )
    return res.redirect("/inv/")

  }else{
    return res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: [{ msg: "Sorry, could not add classification. Please try again." }],
    })
  }
}


/* ***************************
 *  ADDING INVENTORY AND PROCESS
 * ************************** */

invCont.buildAddInv = async function (req, res) {
  const nav = await utilities.getNav();
  const classifications = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classifications,
    errors: null
  })
}

/* ***************************
 *  Process Add Inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()

    // Pull all fields from the form
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    } = req.body

    // Insert into DB
    const addResult = await invModel.addInventoryItem({
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })

    if (addResult) {
      // Success → flash message and redirect
      req.flash("notice", `The ${inv_year} ${inv_make} ${inv_model} was added successfully.`)
      return res.redirect("/inv/")
    } else {
      // Failure → rebuild dropdown and reload form
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      return res.status(501).render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classifications: classificationSelect,
        errors: [{ msg: "Sorry, the inventory item could not be added." }],
        ...req.body  // sticky values
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = invCont