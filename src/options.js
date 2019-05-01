/**
 * https://developers.chrome.com/extensions/richNotifications
 * https://developer.chrome.com/apps/notifications
 * https://developers.google.com/web/updates/2017/04/native-mac-os-notifications#chrome_extension_changes
 */
requirejs.config({
    baseUrl: 'scripts',
    paths: {
        '@': 'options',
        'vue': 'libs/vue',
        'UUID': 'libs/uuid.min',
        'ELEMENT': 'libs/element-ui',
        // libs: 'libs',
        // common: 'common',
    },
});

requirejs(['@/index']);
