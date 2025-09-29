const categoryModels = require('../models/category');

const getAllCategories = function(req, res, next) {
  categoryModels
    .getAllCategoriesQuery()
    .then(([results]) => {
      console.log(results)
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(500).send('Error retrieving categorys from database');
      console.log(error);
    });
};

// const getAllCategories = (req, res, next) => {
//   categoryModels
//     .getAllCategoriesQuery()
//     .then(([results]) => {
//       console.log(results)
//       res.status(200).json(results);
//     })
//     .catch((error) => {
//       res.status(500).send('Error retrieving categorys from database');
//       console.log(error);
//     });
// };

module.exports = { getAllCategories };