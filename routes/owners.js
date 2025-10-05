var express = require('express')
var router = express.Router()

router.use((req, res, next) => {
  // Labeled 'owner'
  req.resource = 'owner'
  next()
})

const {
  getAllOwnersController,
  getOneOwnerController,
} = require('../controllers/owners')

router.get('/', getAllOwnersController)
router.get('/:id', getOneOwnerController)

module.exports = router
