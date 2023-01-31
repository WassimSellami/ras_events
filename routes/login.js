const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const bodyParser = require('body-parser'); 
const cookieParser = require("cookie-parser");
const query = require('../utils/db.js')
const sendEmail = require('../utils/email.js')


router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
dotenv.config();


const authorization = (req, res, next) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY
    const token = req.cookies.token
    if (!token) {
      return res.render('forbidden').status(403)
    }
    try {
      const userData = jwt.verify(token, jwtSecretKey)
      req.id = userData.id
      req.first_name = userData.first_name
      req.last_name = userData.last_name
      return next()
    } catch {
      return render('forbidden').sendStatus(403)
    }
  };


// Login in post method generating JWT and returning it with additionnal user data
router.post('/login', async (req, res, next) => {
    let message="default message"
    let sql = "SELECT * FROM user where email = ?";
    let reqEmail = req.body.email
    let reqPassword = req.body.password
    try {
        var existingUser = await query(sql, [reqEmail])
    } catch {
        message = "Please verify your credentials !"
        return res.render("login", {message: message})
    }
    if (existingUser.length==0){
        message = "Please verify your credentials !"
        return res.render("login", {message: message})
    }
    if(existingUser[0].password != reqPassword){
        message = "Please verify your credentials !"
        return res.render("login", {message: message})

    }
    let token;
    let user = existingUser[0];
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        userData = {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            time: Date()
        };
        // Creating jwt token
        token = jwt.sign(userData, jwtSecretKey);
    } catch (err) {
        const error = new Error("Error! Something went wrong.");
        return next(error);
    }
    sendEmail("User Login", user.first_name+" "+user.last_name);
    req.name = user.first_name    
    res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .redirect('/home')
})


// Logout: removing cookie.
router.get("/logout", authorization,  (req, res) => {
    sendEmail("User Logout", req.name);
    return res
      .clearCookie("token")
      .status(200)
    .redirect("/")
  });


//  Index page: login
router.get('/', (req, res) => {
  res.render('login', null)
})

// Home page needs authorization.
router.get("/home", authorization,(req, res) => {
  res.render('home', {name: req.first_name})
})

module.exports = router