/**
 * Middleware de gestion des erreurs centralisé.
 * Il intercepte toutes les erreurs (err) lancées ou transmises via next(err).
 */

const mapUrlSegmentsToPairs = (urlPath) => {
  const segments = urlPath.split('/').filter(Boolean)

  const mappedPairs = []

  // Parcourir les segments en avançant de 2 par 2
  for (let i = 0; i < segments.length; i += 2) {
    const resource = segments[i]
    const idOrValue = segments[i + 1]
    if ((resource && idOrValue !== undefined) || i === 0) {
      console.log(
        `OK Ressource: ${resource}, ID/Value: ${idOrValue}, Index: ${i}`,
      )
      mappedPairs.push({ [resource]: idOrValue })
    } else if (resource && idOrValue === undefined) {
      // Si l'URL a un nombre impair de segments (ex: '/owner/2/animal')
      console.warn(
        `URL segmentée de manière impaire. Segment final ignoré : ${resource}`,
      )
    }
  }

  return mappedPairs
}

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500

  const urlPath = req.originalUrl
  const resourcePairs = mapUrlSegmentsToPairs(urlPath).filter(Boolean)

  const detailledMessages = []
  if (resourcePairs.length === 0) {
    detailledMessages.push('No resource identifiers found in URL')
  } else {
    resourcePairs.forEach((pair) => {
      const [ressource, id] = Object.entries(pair)[0]
      detailledMessages.push(`[${err.message}] : ${ressource} with id ${id}`)
    })
  }

  console.error(`[${statusCode}] ${detailledMessages}`)

  res.status(statusCode).json({
    error: true,
    message: detailledMessages,
  })
}

module.exports = errorHandler
