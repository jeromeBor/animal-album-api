const categoryModels = require('../models/categories')
const Joi = require('joi')

const postValidationObjectBody = {
  name: Joi.string().alphanum().max(30).required(),
}
const paramsSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
}).required()
const emptyParamsSchema = Joi.object({}).unknown(false)

const createCategoryController = async (req, res, next) => {
  try {
    // Check params (should not be empty)
    const { error: paramsError } = paramsSchema.validate(req.params)
    if (paramsError) {
      const error = new Error('Invalid ID format or missing ID.')
      error.statusCode = 400
      error.validationDetails = paramsError.details
      throw error
    }

    // Validate and sanitize request body
    const { error: validationError, value: validatedData } = Joi.object(
      postValidationObjectBody,
    ).validate(req.body, { abortEarly: false, stripUnknown: true }) // Valider et nettoyer les données
    if (validationError) {
      const error = new Error('Data validation failed')
      error.statusCode = 422
      error.validationDetails = validationError.details
      throw error
    }

    const results = await categoryModels.createCategoryQuery(validatedData)
    res.status(201).json({ id: results.insertId, ...validatedData })
  } catch (error) {
    next(error)
  }
}

const getAllCategoriesController = async (req, res, next) => {
  try {
    // Check params (should be empty)
    const { error: paramsError } = emptyParamsSchema.validate(req.params)
    if (paramsError) {
      const error = new Error('Invalid ID format or missing ID.')
      error.statusCode = 400
      error.validationDetails = paramsError.details
      throw error
    }

    // Check body (should be empty)
    const { error: bodyError } = emptyParamsSchema.validate(req.body)
    if (bodyError) {
      const error = new Error('Request body must be empty for GET requests')
      error.statusCode = 400
      error.validationDetails = bodyError.details
      throw error
    }

    // Check query params
    const querySchema = Joi.object({
      limit: Joi.number().integer().positive().default(10),
      page: Joi.number().integer().min(1).default(1),
    }).unknown(false)
    const { error: queryError, value: validatedQuery } = querySchema.validate(
      req.query,
    )
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
    // Joi shema, validate req.params and req.body
    const bodySchema = Joi.object({}).unknown(false)

    // Joi params validation
    const { error: paramsError, value: validatedParams } =
      paramsSchema.validate(req.params)
    if (paramsError) {
      const error = new Error('Invalid ID format or missing ID.')
      error.statusCode = 400
      error.validationDetails = paramsError.details
      throw error
    }

    // Joi body validaiton (must be empty)
    const { error: bodyError } = bodySchema.validate(req.body)
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
      paramsSchema.validate(req.params)
    if (paramsError) {
      const error = new Error('Invalid ID format or missing ID.')
      error.statusCode = 400
      error.validationDetails = paramsError.details
      throw error
    }

    const { error: validationErrorBody, value: validatedData } = Joi.object(
      postValidationObjectBody,
    ).validate(req.body, { abortEarly: false, stripUnknown: true }) // Valider et nettoyer les données
    if (validationErrorBody) {
      // Les données ne sont pas valides, créer une erreur 422
      const validationError = new Error('Data validation failed')
      validationError.statusCode = 422
      validationError.validationDetails = validationErrorBody.details
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
    const deleteBodySchema = Joi.object({}).unknown(false)
    const { error: bodyError } = deleteBodySchema.validate(req.body)

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
