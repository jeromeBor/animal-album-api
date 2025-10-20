var express = require('express')
var router = express.Router()
const validate = require('../middleware/validation')
const { schemas } = require('../validations/schemas')
const { global, owner } = schemas

router.use((req, res, next) => {
  // Labeled 'owner'
  req.resource = 'owner'
  next()
})

const {
  createOwnerController,
  getAllOwnersController,
  getOneOwnerController,
  getOwnerAnimalController,
  getOwnerAnimalCategoriesController,
  updateOneOwnerController,
  deleteOneOwnerController,
} = require('../controllers/owners')

router.post(
  '/',
  validate(global.emptyParamsSchema, 'params'),
  validate(owner.postBodySchema, 'body'),
  createOwnerController,
)
router.get(
  '/',
  validate(owner.ownerIdParamsSchema, 'params'),
  validate(global.emptyParamsSchema, 'body'),
  validate(global.paginationQuerySchema, 'query'),
  getAllOwnersController,
)
router.get(
  '/:id',
  validate(owner.ownerIdParamsSchema, 'params'),
  validate(global.emptyParamsSchema, 'body'),
  getOneOwnerController,
)
router.get(
  '/:ownerId/animals',
  validate(owner.singleOwnerIdParamsSchema, 'params'),
  validate(global.emptyParamsSchema, 'body'),
  getOwnerAnimalController,
)
router.get(
  '/:ownerId/animals/:animalId/categories',
  validate(owner.ownerAnimalParamsSchema, 'params'),
  validate(global.emptyParamsSchema, 'body'),
  getOwnerAnimalCategoriesController,
)
router.put(
  '/:id',
  validate(owner.ownerIdParamsSchema, 'params'),
  validate(owner.updateBodySchema, 'body'),
  updateOneOwnerController,
)
router.delete(
  '/:id',
  validate(owner.ownerIdParamsSchema, 'params'),
  validate(global.emptyParamsSchema, 'body'),
  deleteOneOwnerController,
)

module.exports = router
