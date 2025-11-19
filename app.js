// app.js (Version corrigée)

require('dotenv').config()

var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var categoryRouter = require('./routes/categories')
var ownerRouter = require('./routes/owners')
var animalRouter = require('./routes/animals')
const errorHandler = require('./middleware/errorHandler')
const db = require('./db')
var app = express()
const port = process.env.PORT || 5000

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// CORS middleware - allow requests from the frontend (localhost:3000)
app.use((req, res, next) => {
  // adjust the origin as needed or use '*' to allow any origin
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:3000')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  // intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

// 1. Routes de l'application
app.use('/categories', categoryRouter)
app.use('/owners', ownerRouter)
app.use('/animals', animalRouter)

app.use(errorHandler)

// catch 404 and forward to error handler

app.listen(port, (error) => {
  if (error) {
    console.log(error)
  } else {
    console.log(`Server listening on port ${port}`)
    // Test de connexion DB après le démarrage du serveur
    db.query('SELECT 1', (err) => {
      if (err) {
        console.error('Database connection failed:', err.message)
      } else {
        console.log('Database connected successfully!')
      }
    })
  }
})

module.exports = app
