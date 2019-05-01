module.exports = {
    extends: 'airbnb-base',
    plugins: [ 'import' ],
    settings: {
        'import/resolver': {
            alias: {
                map: [
                    ['@', './pages/scripts/options'],
                    ['libs', './pages/scripts/libs'],
                    ['common', './pages/scripts/common'],
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
        define: 'readonly',
        $: 'readonly',
        Mustache: 'readonly',
        Vue: 'readonly',
        UUID: 'readonly',
        utils: 'readonly',
        notify: 'readonly',
        templates: 'readonly',
        Runner: 'readonly'
    },
    rules: {
        indent: [2, 4],
        import/no-unresolved: [2, { amd: true }]
    }
};