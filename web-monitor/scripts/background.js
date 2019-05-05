define(['./common/runner'], (Runner) => {
    function noop() {}

    function start(cb = noop) {
        console.log('background start');
        chrome.storage.sync.get('webs', ({ webs = [] }) => {
            const container = [];
            for (let i = 0, l = webs.length; i < l; i += 1) {
                const config = webs[i];
                const runner = new Runner({ background: true, ...config });
                // runner.start();
                container.push(runner);
            }
            window.runners = container;
            cb(container);
        });
    }
    /**
     * @param {*} request - 用户 sendMessage 的第一个参数
     * @param {} sender
     * @param {function} callback - sendMessage 的第二个参数
     */
    chrome.runtime.onMessage.addListener((request, sender, callback = noop) => {
        console.log('background receive message', request);
        const { command, params } = request;
        if (command === 'notify') {
            const { type = 'basic', iconUrl = '../assets/icons/icon-48.png', title, message } = params;
            chrome.notifications.create(null, {
                type,
                iconUrl,
                title,
                message,
            });
        }
        chrome.notifications.onButtonClicked.addListener(() => {
            console.log('click it');
        });
        if (command === 'restart') {
            start();
        }
        callback();
    });

    start();

    window.start = start;
});
