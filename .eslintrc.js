module.exports = {
  // Indique à ESLint que nous utilisons la syntaxe JavaScript moderne
  // et les environnements courants.
  env: {
    browser: false, // Pas d'environnement navigateur (si vous êtes sur Node.js)
    node: true, // Active les variables globales Node.js (ex: 'module', 'require')
    es2021: true, // Supporte toutes les fonctionnalités ES2021
  },

  // Les ensembles de règles préconfigurées.
  extends: [
    'eslint:recommended', // Les règles de base recommandées par ESLint
    'plugin:import/errors', // Assure la validité des importations
    'plugin:import/warnings', // Avertit sur les importations non résolues
  ],

  // Configure le parsing du code
  parserOptions: {
    ecmaVersion: 12, // Ou 2021 pour les dernières fonctionnalités
    sourceType: 'module', // Permet l'utilisation des imports/exports ES6
  },

  // Règles spécifiques que vous voulez personnaliser
  rules: {
    // === Règles de Base et de Correction des Bugs (High Priority) ===
    'no-unused-vars': 'warn', // Avertit si une variable est déclarée mais jamais utilisée
    'no-console': 'off', // Autorise console.log (essentiel en développement Node.js)
    'no-debugger': 'warn', // Avertit sur les points de debug (à retirer en prod)

    // === Règles de Style (Medium Priority) ===
    indent: ['error', 2, { SwitchCase: 1 }], // Force l'indentation à 2 espaces
    quotes: ['error', 'single'], // Force l'utilisation des guillemets simples

    // === Gestion des Points-Virgules (Lien avec Prettier) ===
    // Si vous utilisez Prettier avec "semi": false, DEVEZ utiliser cette règle :
    semi: ['error', 'never'], // Interdit les points-virgules de fin de ligne
    // Si vous décidez de garder les points-virgules, utilisez :
    // 'semi': ['error', 'always'],
  },
}
