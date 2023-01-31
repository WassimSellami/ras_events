const express = require('express')
const path = require('path')
const hoganMiddleware = require('hogan-middleware')

const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'mustache')
app.engine('mustache', hoganMiddleware.__express)
app.use(express.static(path.join(__dirname, 'public')))

// import routes
const index = require('./routes/index')
const api = require('./routes/api')
const loginApi = require('./routes/login')
// set routes
app.use('/', index)
app.use('/home', api)
app.use('/', loginApi)


app.listen(PORT)
console.log(`Server running on htpp://localhost ${PORT}`)


// module.exports = app
