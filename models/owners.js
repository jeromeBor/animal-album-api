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

// Get one Owner by ID
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

module.exports = {
  createOwnerQuery,
  getAllOwnersQuery,
  getOneOwnerQuery,
  updateOwnerQuery,
  deleteOwnerQuery,
}
