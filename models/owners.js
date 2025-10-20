const connection = require('../db')
const db = connection.promise()

// Create a new Owner
const createOwnerQuery = (ownerData) => {
  return db.query('INSERT INTO owner SET ?', [ownerData])
}

// Get all Owners
const getAllOwnersQuery = () => {
  return db.query('SELECT * FROM owner')
}

// Get one owner by ID
const getOneOwnerQuery = (id) => {
  return db.query('SELECT * FROM owner WHERE id = ?', [id])
}

// Update an Owner by ID
const updateOwnerQuery = (id, ownerData) => {
  return db.query('UPDATE owner SET ? WHERE id = ?', [ownerData, id])
}

// Delete an Owner by ID
const deleteOwnerQuery = (id) => {
  return db.query('DELETE FROM owner WHERE id = ?', [id])
}

// ----- OWNER ANIMALS RELATIONSHIP QUERIES -----

const getOwnerAnimalQuery = (id) => {
  return db.query(
    `SELECT a.* FROM animal a 
    JOIN owner_animal oa ON a.id = oa.animal_id
    WHERE oa.owner_id = ?`,
    [id],
  )
}

const checkOwnerAnimalRelationQuery = (ownerId, animalId) => {
  return db.query(
    `SELECT * FROM owner_animal 
     WHERE owner_id = ? AND animal_id = ?
     LIMIT 1`,
    [ownerId, animalId],
  )
}

const getOwnerAnimalCategoriesQuery = (ownerId, animalId) => {
  // Cette requête doit s'assurer que l'ownerId ET l'animalId sont liés
  return db.query(
    `SELECT c.* FROM category c
     JOIN animal_category ac ON c.id = ac.category_id
     JOIN animal a ON ac.animal_id = a.id
     JOIN owner_animal oa ON a.id = oa.animal_id
     WHERE oa.owner_id = ? AND oa.animal_id = ?`,
    [ownerId, animalId],
  )
}

module.exports = {
  createOwnerQuery,
  getAllOwnersQuery,
  getOneOwnerQuery,
  checkOwnerAnimalRelationQuery,
  updateOwnerQuery,
  deleteOwnerQuery,
  getOwnerAnimalQuery,
  getOwnerAnimalCategoriesQuery,
}
