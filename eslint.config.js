import js from '@eslint/js';

export default [
  { ignores: ['assets/*.js', 'node_modules/**', 'reports/**'] },
  js.configs.recommended,
  {
    files: ['src/app.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly', document: 'readonly', localStorage: 'readonly',
        console: 'readonly', IntersectionObserver: 'readonly',
        requestAnimationFrame: 'readonly', setTimeout: 'readonly', URL: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['error', { args: 'none' }],
      'no-undef': 'error'
    }
  }
];