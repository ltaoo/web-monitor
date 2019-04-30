function noop() {}
/**
 * @param {*} request - 用户 sendMessage 的第一个参数
 * @param {} sender
 * @param {function} callback - sendMessage 的第二个参数
 */
chrome.runtime.onMessage.addListener(function(request, sender, callback = noop) {
    const { type, title, message } = request;
    chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: '../assets/icons/icon-48.png',
        title,
        message,
    });
});
