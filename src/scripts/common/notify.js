define(() => {
    /**
     * 发出通知，参数见 https://developers.chrome.com/extensions/richNotifications
     * @param {string} [type=basic] - basic|image|list|progress
     * @param {string} title
     * @param {string} message
     * @param {string} [iconUrl]
     * @param {string} [imageUrl]
     * @param {Array<Object>} [items]
     */
    function notify(params) {
        chrome.runtime.sendMessage({ command: 'notify', params });
        // 如果被加载到 popup 中，上面的就不生效了
        chrome.notifications.create(null, {
            type: 'basic',
            iconUrl: '../assets/icons/icon-48.png',
            ...params,
        });
    }

    return notify;
});
