const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="/inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

// Vehicle details template build

// Format numbers with commas
function formatNumber(num) {
  return new Intl.NumberFormat("en-US").format(num);
}

// Format price as USD
function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
  }).format(price);
}

Util.buildVehicleDetail = async function (vehicleData) {
  // vehicleData is a single object (not an array), so no .length check
  let grid = '<section class="vehicle-detail">';

  grid += `<h1 id="vehicle-detail-h1">${vehicleData.inv_make} ${vehicleData.inv_model} ${vehicleData.inv_year}</h1>`;

  grid += '<div class="vehicle-detail-container">';
  // Image
  grid += `
    <div class="vehicle-image">
      <img src="${vehicleData.inv_image}" 
           alt="Image of ${vehicleData.inv_make} ${vehicleData.inv_model} on CSE Motors">
    </div>
  `;

  // Details
  grid += `
    <div class="vehicle-info">
      <p><strong>Price:</strong> ${formatPrice(vehicleData.inv_price)}</p>
      <p><strong>Mileage:</strong> ${formatNumber(vehicleData.inv_miles)} miles</p>
      <p><strong>Year:</strong> ${vehicleData.inv_year}</p>
      <p><strong>Make:</strong> ${vehicleData.inv_make}</p>
      <p><strong>Model:</strong> ${vehicleData.inv_model}</p>
      <p><strong>Description:</strong> ${vehicleData.inv_description}</p>
      <p><strong>Color:</strong> ${vehicleData.inv_color}</p>
    </div>
  `;

  grid += '</div>'; // close vehicle-detail-container
  grid += '</section>';

  return grid;
};


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util