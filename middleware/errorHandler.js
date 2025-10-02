/**
 * Middleware de gestion des erreurs centralisé.
 * Il intercepte toutes les erreurs (err) lancées ou transmises via next(err).
 *
 * @param {Error} err - L'objet erreur transmis.
 * @param {object} req - L'objet requête Express.
 * @param {object} res - L'objet réponse Express.
 * @param {function} next - La fonction next Express (nécessaire pour un middleware d'erreur).
 */

const mapUrlSegmentsToPairs = (urlPath) => {
  // 1. Nettoyer l'URL et obtenir les segments ['owner', '2', 'animal', '1']
  const segments = urlPath.split('/').filter(Boolean);

  const mappedPairs = [];

  // 2. Parcourir les segments en avançant de 2 en 2
  for (let i = 0; i < segments.length; i += 2) {
    const resource = segments[i]; // Le segment de la ressource (clé)
    const idOrValue = segments[i + 1]; // Le segment de la valeur (valeur)

    // 3. Vérification de l'existence de la paire
    // On s'assure qu'on a bien une paire complète (exclut le cas 'owner/2/animal')
    if (resource && idOrValue !== undefined) {
      // 4. Ajouter la paire au tableau
      mappedPairs.push({ [resource]: idOrValue });
    } else if (resource && idOrValue === undefined) {
      // Si l'URL a un nombre impair de segments (ex: '/owner/2/animal')
      // Vous pouvez choisir de logguer une erreur ou d'ajouter le dernier segment seul
      console.warn(
        `URL segmentée de manière impaire. Segment final ignoré : ${resource}`,
      );
    }
  }

  return mappedPairs;
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const urlPath = req.originalUrl;
  const resourcePairs = mapUrlSegmentsToPairs(urlPath).filter(Boolean);

  const detailledMessages = [];
  if (resourcePairs.length === 0) {
    detailledMessages.push('No resource identifiers found in URL');
  } else {
    resourcePairs.forEach((pair) => {
      const [ressource, id] = Object.entries(pair)[0];
      detailledMessages.push(`[${err.message}] : ${ressource} with id ${id}`);
    });
  }

  console.error(`[${statusCode}] ${detailledMessages}`);

  res.status(statusCode).json({
    error: true,
    message: detailledMessages,
  });
};

module.exports = errorHandler;
