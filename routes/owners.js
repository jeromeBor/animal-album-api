var express = require('express');
var router = express.Router();
const {
  getAllOwersController,
} = require('../controllers/owners')

/* GET users listing. */
router.get('/', getAllOwnersController);


module.exports = router;
