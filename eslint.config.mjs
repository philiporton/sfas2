import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      // Turn off unused variables
      '@typescript-eslint/no-unused-vars': 'off',
      // Turn off any type warnings
      '@typescript-eslint/no-explicit-any': 'off',
      // Turn off missing dependency warnings
      'react-hooks/exhaustive-deps': 'off',
      // Turn off unused React imports (if you have React 17+)
      'react/react-in-jsx-scope': 'off',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig