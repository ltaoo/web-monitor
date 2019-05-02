const path = require('path');

function resolve(p) {
    return path.resolve(__dirname, p);
}

module.exports = {
    entry: './src/scripts/content',
    output: {
        path: resolve('./src'),
        filename: 'content-entry.js',
    },
    resolve: {
        alias: {
            vue: resolve('./src/scripts/libs/vue'),
            ELEMENT: resolve('./src/scripts/libs/element-ui'),
            Mustache: resolve('./src/scripts/libs/mustache.min'),
            Jquery: resolve('./src/scripts/libs/jquery.min'),
            $: resolve('./src/scripts/libs/jquery.min'),
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
