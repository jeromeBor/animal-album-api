const ownerModels = require('../models/owners')
const Joi = require('joi')

const postOwnerValidationObject = {
  // title: Joi.string().max(255).required(),
}

const createOwnerController = async (req, res, next) => {
  try {
    const { error: validationError, value: validatedData } = Joi.object(
      postOwnerValidationObject,
    ).validate(req.body, { abortEarly: false, stripUnknown: true }) // Valider et nettoyer les données

    if (validationError) {
      const error = new Error('Data validation failed')
      error.statusCode = 422
      error.validationDetails = validationError.details
      throw error
    }
    const results = await OwnerModels.createOwnerQuery(validatedData)
    res.status(201).json({ id: results.insertId, ...validatedData })
  } catch (error) {
    next(error)
  }
}

const getAllOwnersController = async (req, res, next) => {
  try {
    // create Joi schema for empty body and query params
    const emptySchema = Joi.object({}).unknown(false)
    const querySchema = Joi.object({
      limit: Joi.number().integer().positive().default(10),
      page: Joi.number().integer().min(1).default(1),
    }).unknown(false)

    const { error: bodyError } = emptySchema.validate(req.body)
    if (bodyError) {
      const error = new Error('Request body must be empty for GET requests')
      error.statusCode = 400
      error.validationDetails = bodyError.details
      throw error
    }

    const { error: queryError, value: validatedQuery } = querySchema.validate(
      req.query,
    )

    if (queryError) {
      const error = new Error('Invalid query parameters')
      error.statusCode = 400
      error.validationDetails = queryError.details
      throw error
    }

    const results = await ownerModels.getAllOwnersQuery(validatedQuery)

    if (!results || (Array.isArray(results) && results.length === 0)) {
      const error = new Error('Data not found')
      error.statusCode = 404
      throw error
    }
    res.status(200).json(results)
  } catch (error) {
    next(error)
  }
}

const getOneOwnerController = async (req, res, next) => {
  try {
    // Joi schema, validate req.params and req.body
    const paramsSchema = Joi.object({
      id: Joi.number().integer().positive().required(),
    }).required()
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

    // Fetch the owner
    const { id } = validatedParams
    let [results] = await ownerModels.getOneOwnerQuery(id)

    if (!results || results.length === 0) {
      const error = new Error(`Owner with ID ${id} not found.`)
      error.statusCode = 404
      throw error
    }

    res.status(200).json(results[0])
  } catch (error) {
    next(error)
  }
}

const updateOneOwnerController = async (req, res, next) => {
  try {
    const { id } = req.params

    const { error: validationErrorBody, value: validatedData } = Joi.object(
      postOwnerValidationObject,
    ).validate(req.body, { abortEarly: false, stripUnknown: true }) // Valider et nettoyer les données

    if (validationErrorBody) {
      // Les données ne sont pas valides, créer une erreur 422
      const validationError = new Error('Data validation failed')
      validationError.statusCode = 422
      validationError.validationDetails = validationErrorBody.details
      throw validationError
    }

    const [initialResults] = await ownerModels.getOneOwnerQuery(id)
    // Vérification de l'existence avant la mise à jour
    if (!initialResults) {
      const notFoundError = new Error(`Owner with ID ${id} not found.`)
      notFoundError.statusCode = 404
      throw notFoundError
    }

    const updateResults = await ownerModels.updateOwnerQuery(id, validatedData)

    if (updateResults.affectedRows === 0) {
      const modificationError = new Error(
        `Owner with ID ${id} could not be modified.`,
      )
      modificationError.statusCode = 500 // Utiliser un nom de variable clair
      throw modificationError
    }

    res.status(200).json({ ...initialResults, ...validatedData })
  } catch (error) {
    console.error('Error during owner update:', error)
    next(error)
  }
}

const deleteOneOwnerController = async (req, res, next) => {
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
    const [results] = await ownerModels.deleteOwnerQuery(id)

    if (results.affectedRows === 0) {
      const error = new Error(`Owner with ID ${id} not found for deletion.`)
      error.statusCode = 404
      throw error
    }

    res.status(204).end()
  } catch (error) {
    console.error('Error during owner deletion:', error)
    next(error)
  }
}

module.exports = {
  createOwnerController,
  getAllOwnersController,
  getOneOwnerController,
  updateOneOwnerController,
  deleteOneOwnerController,
}
