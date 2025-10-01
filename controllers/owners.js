const ownerModels = require('../models/owners');

const getAllOwnersController = function(req, res, next) {
  ownerModels
    .getAllOwnersQuery()
    .then(([results]) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(500).send('Error retrieving owners from database');
      console.log(error);
    });
};

const getOneOwnerController = function(req, res, next) {
  const { id } = req.params;
  ownerModels
    .getOneOwnerQuery(id)
    .then(([results]) => {
      console.log(results)
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(500).send('Error retrieving owner from database');
      console.log(error);
    });
};

module.exports = { getAllOwnersController, getOneOwnerController };   