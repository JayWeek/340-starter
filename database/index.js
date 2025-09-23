const { Pool } = require("pg")
require("dotenv").config()

/* *****************************
 * Connection Pool
 * Works for both local and Render
 ***************************** */
let pool

if (process.env.NODE_ENV === "development") {
  // Local dev: use DATABASE_URL with SSL
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params)
        console.log("executed query", { text })
        return res
      } catch (error) {
        console.error("error in query", { text })
        throw error
      }
    }
  }
} else {
  // Production (Render): always require SSL
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  module.exports = pool
}
