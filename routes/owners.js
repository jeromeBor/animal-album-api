var express = require('express');
var router = express.Router();

const {
  getAllOwnersController,
  getOneOwnerController
} = require('../controllers/owners')

router.get('/', getAllOwnersController);
router.get('/:id', getOneOwnerController);

module.exports = router;
