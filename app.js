// app.js (Version corrigée)

require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var categoryRouter = require('./routes/categories');
var ownerRouter = require('./routes/owners');
const customErrorHandler = require('./middleware/errorHandler'); // Renommé pour éviter la confusion
const db = require('./db');
var app = express();
const port = process.env.PORT || 5000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 1. Routes de l'application
app.use('/category', categoryRouter);
app.use('/owner', ownerRouter);

// 2. Gestionnaire 404 par défaut (catch 404)
// Ce middleware s'exécute si aucune route ci-dessus n'a géré la requête.
app.use(function (req, res, next) {
  next(createError(404));
});

// 3. Intégration de votre gestionnaire d'erreurs personnalisé
// Placez-le avant le gestionnaire d'erreurs par défaut (celui qui rend la vue 'error').
app.use(customErrorHandler);

// 4. Gestionnaire d'erreurs par défaut (à supprimer si votre customErrorHandler fait tout)
// Si vous gardez ceci, il doit être le dernier.
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // Rendu de la page d'erreur (souvent désactivé pour les API JSON)
//   res.status(err.status || 500);
//   res.render('error');
// });

app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Server listening on port ${port}`);
    // Test de connexion DB après le démarrage du serveur
    db.query('SELECT 1', (err) => {
      if (err) {
        console.error('Database connection failed:', err.message);
      } else {
        console.log('Database connected successfully!');
      }
    });
  }
});

module.exports = app;
