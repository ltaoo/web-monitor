const path = require('path');

function resolve(p) {
    return path.resolve(__dirname, p);
}

module.exports = {
    entry: {
        content: './src/scripts/content',
        options: './src/scripts/options',
        background: './src/scripts/background',
        popup: './src/scripts/popup',
    },
    output: {
        path: resolve('./src'),
        filename: '[name]-entry.js',
    },
    resolve: {
        alias: {
            vue: resolve('./src/scripts/libs/vue'),
            ELEMENT: resolve('./src/scripts/libs/element-ui'),
            Mustache: resolve('./src/scripts/libs/mustache.min'),
            jquery: resolve('./src/scripts/libs/jquery.min'),
        },
    },
    mode: 'development',
    watchOptions: {
        ignored: [
            'options.js',
            'components',
            'node_modules',
        ],
        poll: 1000,
    },
};
