const validate = (schema, source) => (req, res, next) => {
  // 'source' détermine l'objet de requête à valider (req.params, req.body, ou req.query)
  const data = req[source]

  // Exécute la validation Joi
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true, // Retirez les champs inconnus du body/query
  })

  if (error) {
    // Crée l'objet d'erreur personnalisé
    const validationError = new Error(`Invalid request ${source}.`)
    validationError.statusCode = 400 // 400 Bad Request
    validationError.details = error.details

    // Passe l'erreur au gestionnaire d'erreurs global (errorHandler)
    return next(validationError)
  }

  // Optionnel mais recommandé : Remplace l'objet de requête original par les données nettoyées
  req[source] = value

  // Si la validation réussit, passe au middleware/contrôleur suivant
  next()
}

module.exports = validate
