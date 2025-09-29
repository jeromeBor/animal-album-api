const connection = require("../db");
const db = connection.promise();


// Create a new animal
const createAnimal = (animalData) => {
  return db.query("INSERT INTO animals SET ?", [animalData]);
};

// Get all animals
const getAllAnimals = () => {
  return db.query("SELECT * FROM animals");
};

// Get one animal by ID
const getAnimalById = (id) => {
  return db.query("SELECT * FROM animals WHERE id = ?", [id]);
};

// Update an animal by ID
const updateAnimalById = (id, animalData) => {
  return db.query("UPDATE animals SET ? WHERE id = ?", [animalData, id]);
};

// Delete an animal by ID
const deleteAnimalById = (id) => {
  return db.query("DELETE FROM animals WHERE id = ?", [id]);
};

module.exports = {
  createAnimal,
  getAllAnimals,
  getAnimalById,
  updateAnimalById,
  deleteAnimalById,
};