var express = require('express')
var router = express.Router()
const { schemas } = require('../validations/schemas')
const validate = require('../middleware/validation')
const { global, category } = schemas

router.use((req, res, next) => {
  // Cela garantit que toutes les erreurs venant de ce routeur seront étiquetées 'owner'
  req.resource = 'owner'
  next()
})

const {
  createCategoryController,
  getAllCategoriesController,
  getOneCategoryController,
  updateOneCategoryController,
  deleteOneCategoryController,
} = require('../controllers/categories')

router.post(
  '/',
  validate(global.emptyParamsSchema, 'params'),
  validate(category.postBodySchema, 'body'),
  createCategoryController,
)
router.get(
  '/',
  validate(global.emptyParamsSchema, 'params'),
  validate(global.emptyParamsSchema, 'body'),
  validate(global.paginationQuerySchema, 'query'),
  getAllCategoriesController,
)
router.get(
  '/:id',
  validate(global.singleIdParamsSchema, 'params'),
  validate(global.emptyParamsSchema, 'body'),
  getOneCategoryController,
)
router.put(
  '/:id',
  validate(global.singleIdParamsSchema, 'params'),
  validate(category.updateBodySchema, 'body'),
  updateOneCategoryController,
)
router.delete(
  '/:id',
  validate(global.singleIdParamsSchema, 'params'),
  validate(global.emptyParamsSchema, 'body'),
  deleteOneCategoryController,
)

module.exports = router
