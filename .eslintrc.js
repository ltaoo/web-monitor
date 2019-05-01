module.exports = {
    extends: 'airbnb-base',
    plugins: [
        'import'
    ],
    env: {
        browser: true,
    },
    globals: {
        chrome: 'readonly',
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
        indent: [2, 4]
    }
};