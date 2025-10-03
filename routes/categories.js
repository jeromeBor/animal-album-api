var express = require('express')
var router = express.Router()

const {
  createCategoryController,
  getAllCategoriesController,
  getOneCategoryController,
  updateOneCategoryController,
  deleteOneCategoryController,
} = require('../controllers/categories')

router.get('/', getAllCategoriesController)
router.get('/:id', getOneCategoryController)
router.put('/:id', updateOneCategoryController)
router.post('/', createCategoryController)
router.delete('/:id', deleteOneCategoryController)

module.exports = router
