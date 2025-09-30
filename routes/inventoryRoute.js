const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const inventoryValidation = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInvId));

router.get("/", utilities.handleErrors(invController.buildManagement));

router.get("/add/classification", utilities.handleErrors(invController.buildAddClassification));

router.post("/add/classification", 
    inventoryValidation.addClassificationRules(),
    inventoryValidation.checkAddClasificationData,
    utilities.handleErrors(invController.addClassification));

router.get("/add/inventory", utilities.handleErrors(invController.buildAddInv))
router.post("/add/inventory", 
    inventoryValidation.addInventoryRules(),
    inventoryValidation.checkAddInventoryData,
    utilities.handleErrors(invController.addInventory)
)

module.exports = router;