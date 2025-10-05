const categoryModels = require('../models/categories')
const Joi = require('joi')

const schemas = require('../middleware/schemas').schemas
const { global, category } = schemas

const createCategoryController = async (req, res, next) => {
  try {
    // Validate and sanitize request body
    const { error: validationError, value: validatedData } = Joi.object(
      category.postBodySchema,
    ).validate(req.body, { abortEarly: false, stripUnknown: true }) // Valider et nettoyer les données
    if (validationError) {
      const error = new Error('Data validation failed')
      error.statusCode = 422
      error.validationDetails = validationError.details
      throw error
    }

    const newId =
      results && Array.isArray(results) ? results[0].insertId : results.insertId
    const results = await categoryModels.createCategoryQuery(validatedData)

    res.status(201).json({ id: newId, ...validatedData })
  } catch (error) {
    next(error)
  }
}

const getAllCategoriesController = async (req, res, next) => {
  try {
    // Check params (should be empty)
    const { error: paramsError } = global.emptyParamsSchema.validate(req.params)
    if (paramsError) {
      const error = new Error('Invalid ID format or missing ID.')
      error.statusCode = 400
      error.validationDetails = paramsError.details
      throw error
    }

    // Check body (should be empty)
    const { error: bodyError } = global.emptyParamsSchema.validate(req.body)
    if (bodyError) {
      const error = new Error('Request body must be empty for GET requests')
      error.statusCode = 400
      error.validationDetails = bodyError.details
      throw error
    }

    // Check query params

    const { error: queryError, value: validatedQuery } =
      global.paginationQuerySchema.validate(req.query)
    if (queryError) {
      const error = new Error('Invalid query parameters')
      error.statusCode = 400
      error.validationDetails = queryError.details
      throw error
    }

    // Fetch categories with pagination
    const { limit, page } = validatedQuery
    const results = await categoryModels.getAllCategoriesQuery(limit, page)

    if (!results || (Array.isArray(results) && results.length === 0)) {
      const error = new Error('Data not found')
      error.statusCode = 404
      throw error
    }
    res.status(200).json(results[0])
  } catch (error) {
    next(error)
  }
}

const getOneCategoryController = async (req, res, next) => {
  try {
    // Joi params validation
    const { error: paramsError, value: validatedParams } =
      global.singleIdParamsSchema.validate(req.params)
    if (paramsError) {
      const error = new Error('Invalid ID format or missing ID.')
      error.statusCode = 400
      error.validationDetails = global.singleIdParamsSchema.details
      throw error
    }

    // Joi body validation (must be empty)
    const { error: bodyError } = global.emptyParamsSchema.validate(req.body)
    if (bodyError) {
      const error = new Error('Request body must be empty for GET requests')
      error.statusCode = 400
      error.validationDetails = bodyError.details
      throw error
    }

    // Fetch the category
    const { id } = validatedParams
    let [results] = await categoryModels.getOneCategoryQuery(id)

    if (!results || results.length === 0) {
      const error = new Error(`Category with ID ${id} not found.`)
      error.statusCode = 404
      throw error
    }

    res.status(200).json(results[0])
  } catch (error) {
    next(error)
  }
}

const updateOneCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params

    const { error: paramsError, value: validatedParams } =
      global.singleIdParamsSchema.validate(req.params)
    if (paramsError) {
      const error = new Error('Invalid ID format or missing ID.')
      error.statusCode = 400
      error.validationDetails = paramsError.details
      throw error
    }

    const { error: validationErrorBody, value: validatedData } = Joi.object(
      category.updateBodySchema,
    ).validate(req.body, { abortEarly: false, stripUnknown: true }) // Valider et nettoyer les données
    if (validationErrorBody) {
      // Les données ne sont pas valides, créer une erreur 422
      const validationError = new Error('Data validation failed')
      validationError.statusCode = 422
      validationError.validationDetails = validationErrorBody.details
      throw validationError
    }

    const [initialResults] = await categoryModels.getOneCategoryQuery(id)
    // Vérification de l'existence avant la mise à jour
    if (!initialResults) {
      const notFoundError = new Error(`Category with ID ${id} not found.`)
      notFoundError.statusCode = 404
      throw notFoundError
    }

    const updateResults = await categoryModels.updateCategoryQuery(
      validatedParams,
      validatedData,
    )

    if (updateResults.affectedRows === 0) {
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
    const { error: bodyError } = global.singleIdParamsSchema.validate(req.body)

    if (bodyError) {
      const error = new Error('Request body must be empty for DELETE requests.')
      error.statusCode = 400
      error.validationDetails = bodyError.details
      throw error
    }

    const { id } = req.params
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
  createCategoryController,
  getAllCategoriesController,
  getOneCategoryController,
  updateOneCategoryController,
  deleteOneCategoryController,
}
