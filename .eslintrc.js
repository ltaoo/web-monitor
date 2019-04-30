module.exports = {
    extends: 'airbnb-base',
    plugins: [
        'import'
    ],
    env: {
        browser: true,
    },
    globals: {
        $: 'readonly',
        chrome: 'readonly',
        Mustache: 'readonly'
    },
    rules: {
        indent: [2, 4]
    }
};