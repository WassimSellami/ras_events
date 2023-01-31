const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
const query = require('../utils/db.js')

router.use(cookieParser());
dotenv.config();


const authorization = (req, res, next) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY
  const token = req.cookies.token
  if (!token) {
    return res.sendStatus(403)
  }
  try {
    const data = jwt.verify(token, jwtSecretKey)
    req.id = data.id
    req.name = data.first_name + " " + data.last_name
    return next()
  } catch {
    return res.sendStatus(403);
  }
}


// param can be event or ressource
router.get('/:param', authorization, async(req, res, next) => {
  try {
    const requestedParam = req.params.param
    let sqlQuery = `SELECT * FROM ${requestedParam}`
    let requestedList = await query(sqlQuery)
    res.render(requestedParam, {items: requestedList})
  } catch(err) {
      const error = new Error("Error! Something went wrongg.");
      return next(error);
  }
})

module.exports = router
