const categoryModels = require('../models/category');

const getAllCategories = (req, res) => {
  categoryModels
    .getAllCategoriesQuery()
    .then(([results]) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(500).send('Error retrieving categorys from database');
      console.log(error);
    });
};

modeule.export = { getAllCategories };