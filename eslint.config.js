import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    // Registra o plugin apenas para permitir os comentários `eslint-disable
    // react/no-unknown-property` já usados nos componentes react-three-fiber
    // (props JSX customizadas, ex.: <mesh position={...}>). Fica off por padrão
    // porque essas props não são "desconhecidas" no contexto do R3F.
    plugins: { react },
    rules: {
      'react/no-unknown-property': 'off',
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
