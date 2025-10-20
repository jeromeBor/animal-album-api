import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  {
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
  },
])
