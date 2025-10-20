var express = require('express')
var router = express.Router()
const validate = require('../middleware/validation')
const { schemas } = require('../validations/schemas')
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
  validate(global.emptySchema, 'params'),
  validate(category.postBodySchema, 'body'),
  createCategoryController,
)
router.get(
  '/',
  validate(global.emptySchema, 'params'),
  validate(global.emptySchema, 'body'),
  validate(global.paginationQuerySchema, 'query'),
  getAllCategoriesController,
)
router.get(
  '/:id',
  validate(global.singleIdParamsSchema, 'params'),
  validate(global.emptySchema, 'body'),
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
  validate(global.emptySchema, 'body'),
  deleteOneCategoryController,
)

module.exports = router
