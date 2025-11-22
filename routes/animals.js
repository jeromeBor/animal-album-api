var express = require('express')
var router = express.Router()
const validate = require('../middleware/validation')
const { schemas } = require('../validations/schemas')
const { global, animal } = schemas
const { imageUpload } = require('./uploadMiddleware.js')
router.use((req, res, next) => {
  // Cela garantit que toutes les erreurs venant de ce routeur seront étiquetées 'owner'
  req.resource = 'animal'
  next()
})

const {
  createAnimalController,
  getAllAnimalsController,
  getOneAnimalController,
  updateOneAnimalController,
  deleteOneAnimalController,
} = require('../controllers/animals')

router.post(
  '/',
  validate(global.emptySchema, 'params'),
  validate(animal.postBodySchema, 'body'),
  imageUpload,
  createAnimalController,
)
router.get(
  '/',
  validate(global.emptySchema, 'params'),
  validate(global.emptySchema, 'body'),
  validate(global.paginationQuerySchema, 'query'),
  getAllAnimalsController,
)
router.get(
  '/:id',
  validate(global.singleIdParamsSchema, 'params'),
  validate(global.emptySchema, 'body'),
  getOneAnimalController,
)
router.put(
  '/:id',
  validate(global.singleIdParamsSchema, 'params'),
  validate(animal.updateBodySchema, 'body'),
  updateOneAnimalController,
)
router.delete(
  '/:id',
  validate(global.singleIdParamsSchema, 'params'),
  validate(global.emptySchema, 'body'),
  deleteOneAnimalController,
)

module.exports = router
