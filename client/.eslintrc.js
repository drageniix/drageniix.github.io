module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    env: {
        node: true,
        browser: true,
        jest: true,
        es6: true
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:jest/recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    rules: {
        'no-console': 'warn'
    },
    settings: {
        react: {
            version: '16.9.0'
        }
    },
    plugins: ['react', 'jest', '@typescript-eslint']
};
