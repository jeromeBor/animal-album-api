const ownerModels = require('../models/owners')

const createOwnerController = async (req, res, next) => {
  try {
    const results = await ownerModels.createOwnerQuery(req.body)

    const newId = results && results.insertId ? results.insertId : null

    res.status(201).json({ id: newId, ...req.body })
  } catch (error) {
    next(error)
  }
}

const getAllOwnersController = async (req, res, next) => {
  try {
    // create Joi schema for empty body and query params
    const { limit, page } = req.query

    const fullResults = await ownerModels.getAllOwnersQuery(limit, page)

    const results = fullResults[0]

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
    const { ownerId } = req.params
    let [results] = await ownerModels.getOneOwnerQuery(ownerId)

    if (!results || results.length === 0) {
      const error = new Error(`Owner with ID ${ownerId} not found.`)
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
    const { ownerId } = req.params

    const [initialCheck] = await ownerModels.getOneOwnerQuery(ownerId)
    // Vérification de l'existence avant la mise à jour
    if (!initialCheck || initialCheck.length === 0) {
      const notFoundError = new Error(`Owner with ID ${ownerId} not found.`)
      notFoundError.statusCode = 404
      throw notFoundError
    }
    const initialOwner = initialCheck[0]

    const updateResults = await ownerModels.updateOwnerQuery(ownerId, req.body)

    res.status(200).json({ ...initialOwner, ...updateResults })
  } catch (error) {
    console.error('Error during owner update:', error)
    next(error)
  }
}

const getOwnerAnimalController = async (req, res, next) => {
  try {
    const { ownerId } = req.params

    let [results] = await ownerModels.getOwnerAnimalQuery(ownerId)

    const [ownerCheck] = await ownerModels.getOneOwnerQuery(ownerId)
    if (!ownerCheck || ownerCheck.length === 0) {
      const error = new Error(`Owner with ID ${ownerId} not found.`)
      error.statusCode = 404
      throw error
    }

    res.status(200).json(results)
  } catch (error) {
    next(error)
  }
}

const getOwnerAnimalCategoriesController = async (req, res, next) => {
  try {
    const { ownerId, animalId } = req.params

    const [ownerCheck] = await ownerModels.getOneOwnerQuery(ownerId)
    if (!ownerCheck || ownerCheck.length === 0) {
      const error = new Error(`Owner with ID ${ownerId} not found.`)
      error.statusCode = 404
      throw error
    }

    let [results] = await ownerModels.getOwnerAnimalCategoriesQuery(ownerId)

    const [relationCheck] = await ownerModels.checkOwnerAnimalRelationQuery(
      ownerId,
      animalId,
    )
    if (!relationCheck || relationCheck.length === 0) {
      // L'animal n'existe pas ou n'appartient pas à ce propriétaire
      const error = new Error(
        `Animal with ID ${animalId} not found for owner ${ownerId}.`,
      )
      error.statusCode = 404
      throw error
    }

    res.status(200).json(results)
  } catch (error) {
    next(error)
  }
}

const deleteOneOwnerController = async (req, res, next) => {
  try {
    const { ownerId } = req.params
    const [results] = await ownerModels.deleteOwnerQuery(ownerId)

    if (results.affectedRows === 0) {
      const error = new Error(
        `Owner with ID ${ownerId} not found for deletion.`,
      )
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
  getOwnerAnimalController,
  getOwnerAnimalCategoriesController,
  updateOneOwnerController,
  deleteOneOwnerController,
}
