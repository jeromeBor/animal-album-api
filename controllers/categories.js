const categoryModels = require('../models/categories')

const createCategoryController = async (req, res, next) => {
  try {
    // CORRECTION 1: Exécuter la requête AVANT d'essayer d'accéder à 'results'
    const results = await categoryModels.createCategoryQuery(req.body)

    // CORRECTION 2: Accès sécurisé à l'ID retourné par la DB
    const newId = results && results.insertId ? results.insertId : null

    // Note: Si votre DB retourne un tableau [[{insertId: X}]], utilisez:
    // const newId = results && Array.isArray(results) && results.length > 0 ? results[0].insertId : null

    res.status(201).json({ id: newId, ...req.body })
  } catch (error) {
    next(error)
  }
}

const getAllCategoriesController = async (req, res, next) => {
  try {
    // Les données validées se trouvent dans req.query
    const { limit, page } = req.query

    const fullResults = await categoryModels.getAllCategoriesQuery(limit, page)

    const results = fullResults[0]
    if (!results || (Array.isArray(results) && results.length === 0)) {
      const error = new Error('Data not found')
      error.statusCode = 404
      throw error
    }
    // CORRECTION 3: Renvoyer le tableau complet des résultats (results), pas juste results[0]
    // (results[0] est souvent le résultat de l'exécution, pas les données elles-mêmes)
    res.status(200).json(results)
  } catch (error) {
    next(error)
  }
}

const getOneCategoryController = async (req, res, next) => {
  try {
    // L'ID validé se trouve dans req.params
    const { id } = req.params

    // Fetch the category
    let [results] = await categoryModels.getOneCategoryQuery(id)

    if (!results || results.length === 0) {
      const error = new Error(`Category with ID ${id} not found.`)
      error.statusCode = 404
      throw error
    }

    // CORRECTION 4: Renvoyer la première ligne de l'ensemble de résultats
    res.status(200).json(results[0])
  } catch (error) {
    next(error)
  }
}

const updateOneCategoryController = async (req, res, next) => {
  try {
    // L'ID validé se trouve dans req.params
    const { id } = req.params
    // Les données validées se trouvent dans req.body

    const [initialCheck] = await categoryModels.getOneCategoryQuery(id)

    // CORRECTION 5: Vérifier si l'objet initial est vide
    if (!initialCheck || initialCheck.length === 0) {
      const notFoundError = new Error(`Category with ID ${id} not found.`)
      notFoundError.statusCode = 404
      throw notFoundError
    }
    const initialCategory = initialCheck[0]

    // CORRECTION 6: Passer l'ID et les données validées
    const [updateResults] = await categoryModels.updateCategoryQuery(
      id, // L'ID à utiliser dans la requête WHERE
      req.body, // Le SET data
    )

    // La vérification affectedRows est facultative si vous renvoyez simplement l'objet mis à jour
    if (updateResults.affectedRows === 0) {
      // Si 0 ligne affectée, cela signifie souvent que les données n'ont pas changé
    }

    // On renvoie les données initiales fusionnées avec les données modifiées
    res.status(200).json({ ...initialCategory, ...req.body })
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
