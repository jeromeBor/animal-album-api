var express = require('express');
var router = express.Router();
const {
  getAllCategoriesController,
  getOneCategoryController
} = require('../controllers/categories')

console.log(getAllCategoriesController)
/* GET users listing. */
router.get('/', getAllCategoriesController);
router.get('/:id', getOneCategoryController);


module.exports = router;
