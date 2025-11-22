// eslint.config.mjs

import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  // ----------------------------------------------------
  // 1. CONFIGURATION POUR LE CODE CLIENT (FRONTEND/BROWSER)
  // S'applique à tous les fichiers .js, .jsx, etc. qui sont dans un environnement DOM.
  // ----------------------------------------------------
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      // 🚨 Utilisez globals.browser pour le code Client
      globals: globals.browser,
    },
  },

  {
    // 💡 Ciblez vos fichiers backend. Adaptez ce chemin !
    // Par exemple: 'server/**/*.js', 'api/**/*.js' ou 'index.js' si c'est la racine.
    files: [
      '*.js',
      'server/**/*.js',
      'routes/**/*.js',
      'controllers/**/*.js',
      'middleware/**/*.js',
      'bin/**/*.js',
      'models/**/*.js',
      'validations/**/*.js',
    ],
    languageOptions: {
      // 🚨 Utilisez globals.node pour le code Serveur
      // Ceci définit 'require', 'module', '__dirname', et 'process'.
      globals: globals.node,
      sourceType: 'commonjs', // Use commonjs for backend files that use require()
    },
    // Vous pourriez vouloir désactiver certaines règles React ici si elles s'appliquent à tous les fichiers .js
  },

  // ----------------------------------------------------
  // 3. CONFIGURATION SPÉCIFIQUE À REACT (S'applique au code JSX/Client)
  // ----------------------------------------------------
  pluginReact.configs.flat.recommended,
])
