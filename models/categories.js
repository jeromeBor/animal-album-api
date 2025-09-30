const connection = require("../db");
const db = connection.promise();


// Create a new category
const createCategoryQuery = (CategoryData) => {
  return db.query("INSERT INTO category SET ?", [CategoryData]);
};

// Get all Categories
const getAllCategoriesQuery = () => {
  return db.query("SELECT * FROM category");
};

// Get one Category by ID
const getOneCategoryQuery = (id) => {
  return db.query("SELECT * FROM category WHERE id = ?", [id]);
};

// // Update an Category by ID
// const updateCategory = (id, CategoryData) => {
//   return db.query("UPDATE category SET ? WHERE id = ?", [CategoryData, id]);
// };

// Delete an Category by ID
const deleteCategoryQuery = (id) => {
  return db.query("DELETE FROM category WHERE id = ?", [id]);
};

module.exports = {
  createCategoryQuery,
  getAllCategoriesQuery,
  getOneCategoryQuery,
//   updateCategory,
  deleteCategoryQuery,
};