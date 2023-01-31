
const express = require('express')
const router = express.Router()

  
router.get('/login', (req, res) => {
  res.render('login', null)
})

router.get('/home', (req, res) => {
  res.render('home', null)
})


module.exports = router
