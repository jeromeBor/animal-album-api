const Joi = require('joi')

const schemas = {
  global: {
    // Pour les requêtes sans paramètres ni corps
    emptyParamsSchema: Joi.object({}).unknown(false),
    // Pour valider l'ID dans les paramètres de route (:id)
    singleIdParamsSchema: Joi.object({
      id: Joi.number().integer().positive().required(),
    })
      .unknown(false)
      .required(),
    // Pour la pagination des GETs avec query params ?limit=&page=
    paginationQuerySchema: Joi.object({
      limit: Joi.number().integer().positive().default(10),
      page: Joi.number().integer().min(1).default(1),
    }).unknown(false),
  },
  category: {
    postBodySchema: Joi.object({
      name: Joi.string().alphanum().max(30).required(),
    })
      .unknown(false)
      .min(1),
    updateBodySchema: Joi.object({
      name: Joi.string().alphanum().max(30),
    })
      .min(1)
      .unknown(false),
  },
  owner: {},
  animals: {},
}

module.exports = {
  schemas,
}
