/**
 * Middleware de gestion des erreurs centralisé.
 * Il intercepte toutes les erreurs (err) lancées ou transmises via next(err).
 */

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'An unexpected error occurred.'

  const resource = req.resources || req.path.split('/')[1] || 'general'

  const details =
    err.details ||
    (err.validationDetails
      ? err.validationDetails.map((d) => d.message)
      : undefined)

  const errorResponse = {
    error: {
      // Utilisez la ressource comme clé principale
      [resource]: {
        code: statusCode,
        message: message,
      },
    },
  }
  if (details) {
    errorResponse.error[resource].details = details
  }
  console.log(err)

  console.error(
    `[${resource.toUpperCase()} Error ${statusCode}]: ${message}`,
    details || '',
  )

  res.status(statusCode).json(errorResponse)
}

module.exports = errorHandler
