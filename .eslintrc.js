module.exports = {
    extends: 'airbnb-base',
    plugins: [ 'import' ],
    settings: {
        'import/resolver': {
            alias: {
                map: [
                    ['vue', './src/scripts/libs/vue'],
                    ['ELEMENT', './src/scripts/libs/element-ui'],
                    ['Mustache', './src/scripts/libs/mustache.min'],
                    ['jquery', './src/scripts/libs/jquery.min'],
                ],
                extensions: ['.ts', '.js', '.jsx', '.json']
            }
        }
    },
    env: {
        browser: true,
    },
    globals: {
        chrome: 'readonly',
        requirejs: 'readonly',
        define: 'readonly'
    },
    rules: {
        indent: [2, 4],
        'import/no-unresolved': [2, { amd: true }],
        'import/no-amd': [0]
    }
};