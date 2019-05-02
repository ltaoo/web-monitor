/**
 * https://developers.chrome.com/extensions/richNotifications
 * https://developer.chrome.com/apps/notifications
 * https://developers.google.com/web/updates/2017/04/native-mac-os-notifications#chrome_extension_changes
 */
requirejs.config({
    baseUrl: 'scripts',
    paths: {
        vue: 'libs/vue',
        ELEMENT: 'libs/element-ui',
        Mustache: 'libs/mustache.min',
        jquery: 'libs/jquery.min',
        // 如果在这里有定义，require 时的路径就不一样了
        // 'UUID': 'libs/uuid.min',
        // libs: 'libs',
        // common: 'common',
    },
});

// 很奇葩，如果该文件名为 options，这里去加载的就是该文件，而不是 scripts/options
requirejs(['options']);
