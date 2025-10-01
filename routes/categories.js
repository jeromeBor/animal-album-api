var express = require('express');
var router = express.Router();

const {
  getAllCategoriesController,
  getOneCategoryController
} = require('../controllers/categories')

router.get('/', getAllCategoriesController);
router.get('/:id', getOneCategoryController);

module.exports = router;
