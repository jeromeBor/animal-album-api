const animalModels = require('../models/animals')

const createAnimalController = async (req, res, next) => {
  try {
    const [results] = await animalModels.createAnimalQuery(req.body)
    const newId = results && results.insertId ? results.insertId : null

    res.status(201).json({ id: newId, ...req.body })
  } catch (error) {
    next(error)
  }
}

const getAllAnimalsController = async (req, res, next) => {
  try {
    const { limit, page } = req.query

    const fullResults = await animalModels.getAllAnimalesQuery(limit, page)

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

const getOneAnimalController = async (req, res, next) => {
  try {
    const { id } = req.params

    let [results] = await animalModels.getOneAnimalQuery(id)

    if (!results || results.length === 0) {
      const error = new Error(`Animal with ID ${id} not found.`)
      error.statusCode = 404
      throw error
    }

    res.status(200).json(results[0])
  } catch (error) {
    next(error)
  }
}

const getAnimalOwnerController = async (req, res, next) => {
  try {
    const { id } = req.params

    let [results] = await animalModels.getAnimalOwnerQuery(id)

    if (!results || results.length === 0) {
      const error = new Error(`Animal with ID ${id} not found.`)
      error.statusCode = 404
      throw error
    }

    res.status(200).json(results[0])
  } catch (error) {
    next(error)
  }
}

const updateOneAnimalController = async (req, res, next) => {
  try {
    const { id } = req.params

    const [initialCheck] = await animalModels.getOneAnimalQuery(id)

    if (!initialCheck || initialCheck.length === 0) {
      const notFoundError = new Error(`Animal with ID ${id} not found.`)
      notFoundError.statusCode = 404
      throw notFoundError
    }
    const initialAnimal = initialCheck[0]

    await animalModels.updateAnimalQuery(id, req.body)

    // On renvoie les données initiales fusionnées avec les données modifiées
    res.status(200).json({ ...initialAnimal, ...req.body })
  } catch (error) {
    console.error('Error during animal update:', error)
    next(error)
  }
}

const deleteOneAnimalController = async (req, res, next) => {
  try {
    const { id } = req.params
    const [results] = await animalModels.deleteAnimalQuery(id)

    if (results.affectedRows === 0) {
      const error = new Error(`Animal with ID ${id} not found for deletion.`)
      error.statusCode = 404
      throw error
    }

    res.status(204).end()
  } catch (error) {
    console.error('Error during animal deletion:', error)
    next(error)
  }
}

module.exports = {
  createAnimalController,
  getAllAnimalsController,
  getOneAnimalController,
  getAnimalOwnerController,
  updateOneAnimalController,
  deleteOneAnimalController,
}
