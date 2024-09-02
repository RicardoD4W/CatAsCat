module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:astro/recommended',
        'plugin:prettier/recommended'
    ],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error',
        // Aquí puedes agregar o modificar otras reglas según tus necesidades.
    },
    overrides: [
        {
            // Define una configuración específica para los archivos de Astro
            files: ['*.astro'],
            parser: 'astro-eslint-parser',
            parserOptions: {
                parser: '@typescript-eslint/parser', // Si estás usando TypeScript
                extraFileExtensions: ['.astro'],
            },
            rules: {
                // Añade o modifica reglas específicas para archivos .astro
            },
        },
    ],
};
