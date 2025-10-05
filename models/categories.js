const connection = require('../db')
const db = connection.promise()

// Create a new category
const createCategoryQuery = (CategoryData) => {
  return db.query('INSERT INTO category SET ?', [CategoryData])
}

// Get all Categories
const getAllCategoriesQuery = (limit = 10, page = 1) => {
  console.log(limit, page)
  // Calcul de l'OFFSET (nombre de lignes à sauter)
  const offset = (page - 1) * limit

  // ⚠️ Syntaxe SQL Server pour la pagination : OFFSET/FETCH NEXT
  const sql = `
    SELECT * FROM category 
    ORDER BY id ASC  
    LIMIT ? 
    OFFSET ?;
  `

  // Dans SQL Server, les placeholders sont souvent nommés (@offset, @limit)
  // ou simplement des ? selon votre driver Node.js.
  // La méthode db.query doit lier ces variables nommées ou utiliser des ?
  const values = [limit, offset]
  console.log(sql, values)
  // IMPORTANT: Si votre driver supporte les ? comme placeholders :
  return db.query(sql, values)
}

// Get one Category by ID
const getOneCategoryQuery = (id) => {
  return db.query('SELECT * FROM category WHERE id = ?', [id])
}

// Update an Category by ID
const updateCategory = (id, CategoryData) => {
  return db.query('UPDATE category SET ? WHERE id = ?', [CategoryData, id])
}

// Delete an Category by ID
const deleteCategoryQuery = (id) => {
  return db.query('DELETE FROM category WHERE id = ?', [id])
}

module.exports = {
  createCategoryQuery,
  getAllCategoriesQuery,
  getOneCategoryQuery,
  updateCategory,
  deleteCategoryQuery,
}
