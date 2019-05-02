const path = require('path');

function resolve(...args) {
    return path.resolve(__dirname, ...args);
}

const SRC = 'web-monitor';

module.exports = {
    entry: {
        content: resolve(SRC, 'scripts/content'),
        options: resolve(SRC, 'scripts/options'),
        background: resolve(SRC, 'scripts/background'),
        popup: resolve(SRC, 'scripts/popup'),
    },
    output: {
        path: resolve(SRC),
        filename: '[name]-entry.js',
    },
    resolve: {
        alias: {
            vue: resolve(SRC, 'scripts/libs/vue'),
            ELEMENT: resolve(SRC, 'scripts/libs/element-ui'),
            Mustache: resolve(SRC, 'scripts/libs/mustache.min'),
            jquery: resolve(SRC, 'scripts/libs/jquery.min'),
        },
    },
    mode: 'development',
    watchOptions: {
        ignored: [
            'node_modules',
        ],
        poll: 4000,
    },
};
