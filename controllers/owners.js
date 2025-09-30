const categoryModels = require('../models/owners');

const getAllOwnwersController = function(req, res, next) {
  categoryModels
    .getAllOwnwersControllerQuery()
    .then(([results]) => {
      console.log(results)
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(500).send('Error retrieving categorys from database');
      console.log(error);
    });
};

const getOneOwnerController = function(req, res, next) {
  categoryModels
    .getOneCategoryQuery()
    .then(([results]) => {
      console.log(results)
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(500).send('Error retrieving categorys from database');
      console.log(error);
    });
};

module.exports = { getAllOwnwersController, getOneOwnerController };   