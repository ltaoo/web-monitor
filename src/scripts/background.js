function noop() {}
/**
 * @param {*} request - 用户 sendMessage 的第一个参数
 * @param {} sender
 * @param {function} callback - sendMessage 的第二个参数
 */
chrome.runtime.onMessage.addListener((request, sender, callback = noop) => {
    const { command, params } = request;
    if (command === 'notify') {
        const { type = 'basic', title, message } = params;
        chrome.notifications.create(null, {
            type,
            iconUrl: '../assets/icons/icon-48.png',
            title,
            message,
        });
    }
    callback();
});
