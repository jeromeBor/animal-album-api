const categoryModels = require('../models/categories');

const getAllCategoriesController = function(req, res, next) {
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

const getOneCategoryController = function(req, res, next) {
  const { id } = req.params;
  categoryModels
    .getOneCategoryQuery(id)
    .then(([results]) => {
      if (results.length === 0) {
        return res.status(404).send('Category not found');
      }
      res.status(200).json(results[0]);
    })
    .catch((error) => {
      res.status(500).send('Error retrieving category from database with params :' + {req});
      console.log(error);
    });
}

  const deleteOneCategoryController = function(req, res, next) {
    categoryModels.deleteCategoryQuery()
     .then(([results]) => {
      if (results.length === 0) {
        return res.status(404).send('Category not found');
      }
      res.status(200).json(results[0]);
    })
    .catch((error) => {
      res.status(500).send('Error retrieving category from database with params :' + {req});
      console.log(error);
    });
  }


module.exports = { getAllCategoriesController, getOneCategoryController, deleteOneCategoryController };   