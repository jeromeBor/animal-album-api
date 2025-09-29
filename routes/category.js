var express = require('express');
var router = express.Router();
const {
  getAllCategories,
} = require('../controllers/category')

console.log(getAllCategories)
/* GET users listing. */
router.get('/', getAllCategories);
//   function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;
