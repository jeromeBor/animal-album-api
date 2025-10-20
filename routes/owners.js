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
  validate(owner.emptySchema, 'body'),
  createOwnerController,
)
router.get(
  '/',
  validate(global.emptySchema, 'params'),
  validate(global.emptySchema, 'body'),
  validate(global.paginationQuerySchema, 'query'),
  getAllOwnersController,
)
router.get(
  '/:ownerId',
  validate(owner.ownerIdParamsSchema, 'params'),
  validate(global.emptySchema, 'body'),
  getOneOwnerController,
)
router.get(
  '/:ownerId/animals',
  validate(owner.ownerIdParamsSchema, 'params'),
  validate(global.emptySchema, 'body'),
  getOwnerAnimalController,
)
router.get(
  '/:ownerId/animals/:animalId/categories',
  validate(owner.ownerAnimalParamsSchema, 'params'),
  validate(global.emptySchema, 'body'),
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
  validate(global.emptySchema, 'body'),
  deleteOneOwnerController,
)

module.exports = router
