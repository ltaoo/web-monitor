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
    }

    return notify;
});
