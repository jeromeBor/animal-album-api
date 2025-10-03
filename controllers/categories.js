const categoryModels = require('../models/categories')
const Joi = require('joi')

const postCategoryValidationObject = {
  title: Joi.string().max(255).required(),
}

const getAllCategoriesController = async (req, res, next) => {
  try {
    const results = await categoryModels.getAllCategoriesQuery()
    if (!results || (Array.isArray(results) && results.length === 0)) {
      const error = new Error('NOT_FOUND')
      error.statusCode = 404
      throw error
    }
    res.status(200).json(results)
  } catch (error) {
    next(error)
  }
}

const getOneCategoryController = async (req, res, next) => {
  try {
    const paramsSchema = Joi.object({
      id: Joi.number().integer().positive().required(),
    }).required()

    const emptySchema = Joi.object({}).unknown(false)

    const { id } = req.params
    let results = []

    const { error: paramsError, value: validatedParams } =
      paramsSchema.validate(req.params)
    results = await categoryModels.getOneCategoryQuery(id)
    if (paramsError) {
      // wip
    }

    const { error: bodyError, value: validatedBody } = paramsSchema.validate(
      req.params,
    )

    if (bodyError) {
      // wip
    }

    if (!results.length) {
      const error = new Error('NOT_FOUND')
      error.statusCode = 404
      throw error
    }

    res.status(200).json(results[0])
  } catch (error) {
    next(error)
  }
}

const updateOneCategoryController = async (req, res, next) => {
  const { id } = req.params
  const dataToUpdate = req.body // Les données brutes du corps

  try {
    const { error: validationErrorJoi, value: validatedData } = Joi.object(
      postCategoryValidationObject,
    ).validate(dataToUpdate, { abortEarly: false, stripUnknown: true }) // Valider et nettoyer les données

    if (validationErrorJoi) {
      // Les données ne sont pas valides, créer une erreur 422
      const validationError = new Error('Data validation failed')
      validationError.statusCode = 422
      validationError.validationDetails = validationErrorJoi.details
      throw validationError
    }

    const [initialResults] = await categoryModels.getOneOwnerQuery(id)
    // Vérification de l'existence avant la mise à jour
    if (!initialResults) {
      const notFoundError = new Error(`Category with ID ${id} not found.`)
      notFoundError.statusCode = 404
      throw notFoundError
    }

    const updateResults = await categoryModels.updateCategoryQuery(
      id,
      validatedData,
    )

    if (updateResults.affectedRows === 0) {
      // La mise à jour n'a pas pu être effectuée
      const modificationError = new Error(
        `Category with ID ${id} could not be modified.`,
      )
      modificationError.statusCode = 500 // Utiliser un nom de variable clair
      throw modificationError
    }

    res.status(200).json({ ...initialResults, ...validatedData })
  } catch (error) {
    console.error('Error during category update:', error)
    next(error)
  }
}

const deleteOneCategoryController = async (req, res, next) => {
  try {
    const deleteBodySchema = Joi.object({}).unknown(false)
    const { error: bodyError } = deleteBodySchema.validate(req.body)
    const { id } = req.params

    if (bodyError) {
      const error = new Error('Request body must be empty for DELETE requests.')
      error.statusCode = 400
      error.validationDetails = bodyError.details
      throw error
    }

    const [results] = await categoryModels.deleteCategoryQuery(id)

    if (results.affectedRows === 0) {
      const error = new Error(`Category with ID ${id} not found for deletion.`)
      error.statusCode = 404
      throw error
    }

    res.status(204).end()
  } catch (error) {
    console.error('Error during category deletion:', error)
    next(error)
  }
}

module.exports = {
  getAllCategoriesController,
  getOneCategoryController,
  updateOneCategoryController,
  deleteOneCategoryController,
}
