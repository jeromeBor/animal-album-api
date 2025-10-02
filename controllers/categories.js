const categoryModels = require('../models/categories');
const Joi = require('joi');

// const postDrawingValidationObject = {
//   title: Joi.string().max(255).required(),
//   imageLink: Joi.string().max(255).allow(null, ''),
//   postContent: Joi.string(),
//   dateOfWrite: Joi.number().required(),
//   tagsId: Joi.number().integer().required(),
// };

const getAllCategoriesController = async (req, res, next) => {
  try {
    const results = await categoryModels.getAllCategoriesQuery();
    if (!results || (Array.isArray(results) && results.length === 0)) {
      const error = new Error('NOT_FOUND');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const getOneCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [results] = await categoryModels.getOneCategoryQuery(id);
    if (!results.length) {
      const error = new Error('NOT_FOUND');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(results[0]);
  } catch (error) {
    next(error);
  }
};

const updateOneCategoryController = async (req, res, next) => {
  const { id } = req.params;
  const dataToUpdate = req.body; // Les données envoyées par l'utilisateur

  try {
    const [initialResults] = await categoryModels.getOneOwnerQuery(id);
    console.log('initialResults', initialResults);
    if (!initialResults) {
      // Création d'une erreur 404 si la ressource n'est pas trouvée
      const error = new Error('NOT_FOUND');
      error.statusCode = 404;
      throw error;
    }

    const updateResults = await categoryModels.updateCategoryQuery(
      id,
      dataToUpdate,
    );

    if (updateResults.affectedRows === 0) {
      const error = new Error('NOT_FOUND');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ ...initialResults, ...dataToUpdate });
  } catch (error) {
    console.error('Error during category update:', error);
    next(error);
  }
};

const deleteOneCategoryController = async (req, res, next) => {
  // 1. Récupération de l'ID de la catégorie à supprimer
  const { id } = req.params;

  try {
    const [results] = await categoryModels.deleteCategoryQuery(id);

    if (results.affectedRows === 0) {
      const error = new Error(`Category with ID ${id} not found for deletion.`);
      error.statusCode = 404;
      throw error;
    }

    res.status(204).end();
  } catch (error) {
    console.error('Error during category deletion:', error);
    next(error);
  }
};

module.exports = {
  getAllCategoriesController,
  getOneCategoryController,
  updateOneCategoryController,
  deleteOneCategoryController,
};
