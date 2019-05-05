const path = require('path');
const ROOT = 'web-monitor';

function resolve(...args) {
    return path.resolve(__dirname, ...args);
}

const SRC = 'web-monitor';

module.exports = {
    extends: 'airbnb-base',
    plugins: [ 'import' ],
    settings: {
        'import/resolver': {
            alias: {
                map: [
                    ['vue', resolve(SRC, 'scripts/libs/vue')],
                    ['ELEMENT', resolve(SRC, 'scripts/libs/element-ui')],
                    ['Mustache', resolve(SRC, 'scripts/libs/mustache.min')],
                    ['jquery', resolve(SRC, 'scripts/libs/jquery.min')],
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
        mina: 'readonly',
        SVGLoader: 'readonly'
    },
    rules: {
        indent: [2, 4],
        'import/no-unresolved': [2, { amd: true }],
        'import/no-amd': [0],
        'linebreak-style': [0]
    }
};