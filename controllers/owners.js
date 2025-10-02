const ownerModels = require('../models/owners');

const getAllOwnersController = async (req, res, next) => {
  try {
    const [results] = await ownerModels.getAllOwnersQuery();

    if (!results || (Array.isArray(results) && results.length === 0)) {
      const error = new Error('NOT_FOUND');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const getOneOwnerController = async (req, res, next) => {
  const { id } = req.params;

  try {
    const [results] = await ownerModels.getOneOwnerQuery(id);

    if (![results].length) {
      console.log([results]);
      return res.status(404).send(`Owner with ID ${id} not found`);
    }

    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const updateOneOwnerController = async (req, res) => {
  const id = req.params.id; // Définissez la variable id

  try {
    const initialResults = await categoryModels.getOneOwnerQuery(id);

    if (!initialResults) {
      // Lancer une erreur si la ressource n'est pas trouvée
      throw new Error('RECORD_NOT_FOUND');
    }

    const updateResults = await updateOwnerQuery(id, req);
    if (updateResults.affectedRows === 0) {
      throw new Error('RECORD_NOT_FOUND');
    }

    // On renvoie les résultats initiaux (si besoin) et les données du corps de la requête.
    res.status(200).json({ ...initialResults, ...req.body });
  } catch (err) {
    // Gestion des erreurs centralisée
    console.error(err);

    if (err.message === 'RECORD_NOT_FOUND') {
      res.status(404).send(`Drawing with id ${id} not found`);
    } else if (err.message === 'INVALID_DATA') {
      // Assurez-vous que 'validationErrors' est accessible ici si nécessaire
      res.status(422).json({ validationErrors });
    } else {
      res.status(500).send('error updating a drawing');
    }
  }
};

module.exports = {
  getAllOwnersController,
  getOneOwnerController,
  updateOneOwnerController,
};
