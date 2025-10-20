const categoryModels = require('../models/categories')

const createCategoryController = async (req, res, next) => {
  try {
    const results = await categoryModels.createCategoryQuery(req.body)

    const newId = results && results.insertId ? results.insertId : null

    res.status(201).json({ id: newId, ...req.body })
  } catch (error) {
    next(error)
  }
}

const getAllCategoriesController = async (req, res, next) => {
  try {
    const { limit, page } = req.query

    const fullResults = await categoryModels.getAllCategoriesQuery(limit, page)

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

const getOneCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params

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

    const [initialCheck] = await categoryModels.getOneCategoryQuery(id)

    if (!initialCheck || initialCheck.length === 0) {
      const notFoundError = new Error(`Category with ID ${id} not found.`)
      notFoundError.statusCode = 404
      throw notFoundError
    }
    const initialCategory = initialCheck[0]

    const updateResults = await categoryModels.updateCategoryQuery(id, req.body)

    // On renvoie les données initiales fusionnées avec les données modifiées
    res.status(200).json({ ...initialCategory, ...updateResults })
  } catch (error) {
    console.error('Error during category update:', error)
    next(error)
  }
}

const deleteOneCategoryController = async (req, res, next) => {
  try {
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
