const connection = require('../db')
const db = connection.promise()

// Create a new animal
const createAnimalQuery = (AnimalData) => {
  return db.query('INSERT INTO animal SET ?', [AnimalData])
}

// Get all Animals
const getAllAnimalsQuery = (limit = 10, page = 1) => {
  // Calcul de l'OFFSET (nombre de lignes à sauter)
  const offset = (page - 1) * limit

  const sql = `
    SELECT * FROM animal 
    ORDER BY id ASC  
    LIMIT ? 
    OFFSET ?;
  `
  return db.query(sql, [limit, offset])
}

// Get one Animal by ID
const getOneAnimalQuery = (id) => {
  return db.query('SELECT * FROM animal WHERE id = ?', [id])
}

const getAnimalOwnerQuery = (id) => {
  return db.query(
    `SELECT o.*
    FROM owner_animal oa
    JOIN o oa ON oa.owner_id = o.id
    WHERE oa.animal_id = ?`,
    [id],
  )
}

// Update an Animal by ID
const updateAnimal = (id, AnimalData) => {
  return db.query('UPDATE animal SET ? WHERE id = ?', [AnimalData, id])
}

// Delete an Animal by ID
const deleteAnimalQuery = (id) => {
  return db.query('DELETE FROM animal WHERE id = ?', [id])
}

module.exports = {
  createAnimalQuery,
  getAllAnimalsQuery,
  getOneAnimalQuery,
  getAnimalOwnerQuery,
  updateAnimal,
  deleteAnimalQuery,
}
