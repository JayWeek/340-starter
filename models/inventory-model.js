const { text } = require("body-parser")
const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get a classification by ID
 * ************************** */
async function getClassificationById(classification_id) {
  try {
    const result = await pool.query(
      `SELECT classification_id, classification_name
       FROM public.classification
       WHERE classification_id = $1`,
      [classification_id]
    )
    return result.rows[0] || null
  } catch (error) {
    console.error("Database error in getClassificationById:", error)
    throw error
  }
}

async function getVehicleById(inv_id) {
  const query = {
    text: `SELECT * FROM public.inventory WHERE inv_id = $1`,
    values: [inv_id],
    name: 'fetch-vehicle-by-id' // prepared statement identifier
  }

  try {
    const result = await pool.query(query)
    return result.rows[0]
  } catch (error) {
    console.error("Database error in getVehicleById:", error)
    throw error
  }
}

async function addClassification(classification_name) {
  const query = {
    text: `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING classification_id, classification_name`,
    values: [classification_name],
    name: 'Add-classification'
  }
  try {
    const result = await pool.query(query)
    return result.rows[0] // return the inserted row
  } catch (error) {
    return Promise.reject(error) // let controller's try/catch or global handler manage it
  }
  
}

async function addInventoryItem(itemData) {
  const query = {
    text: `INSERT INTO public.inventory
           (inv_make, inv_model, inv_year, inv_description, inv_image,
            inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
           RETURNING inv_id`,
    values: [
      itemData.inv_make,
      itemData.inv_model,
      itemData.inv_year,
      itemData.inv_description,
      itemData.inv_image,
      itemData.inv_thumbnail,
      itemData.inv_price,
      itemData.inv_miles,
      itemData.inv_color,
      itemData.classification_id
    ]
  }

  try {
    const result = await pool.query(query)
    return result.rows[0]
  } catch (error) {
    console.error("Database error in addInventoryItem:", error)
    return null
  }
}






module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventoryItem, getClassificationById}; //unnaed object getClassifications exported