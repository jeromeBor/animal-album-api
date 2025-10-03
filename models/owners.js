const connection = require('../db')
const db = connection.promise()

// ------- OWNER QUERIES -------

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

const getOwnerAnimalController = (id) => {
  return db.query(
    `SELECT a.* FROM animal a 
    JOIN owner_animal oa ON a.id = oa.animal_id
    WHERE oa.owner_id = ?`,
    [id],
  )
}

const getOwnerAnimalCategoriesController = (id) => {
  return db.query(
    `SELECT DISTINCT
      c.name AS category_name,
      c.id AS category_id
    FROM
      owner_animal oa
    JOIN
      animal a ON oa.animal_id = a.id
    JOIN
      category c ON a.category_id = c.id
    WHERE
      oa.owner_id = ?`,
    [id],
  )
}

module.exports = {
  createOwnerQuery,
  getAllOwnersQuery,
  getOneOwnerQuery,
  updateOwnerQuery,
  deleteOwnerQuery,
  getOwnerAnimalController,
  getOwnerAnimalCategoriesController,
}
