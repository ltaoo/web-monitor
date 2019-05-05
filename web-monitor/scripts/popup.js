define([
    'vue',
    'ELEMENT',
    './common/runner',
], (
    Vue,
    ELEMENT,
) => {
    Vue.use(ELEMENT);

    /* eslint-disable no-new */
    new Vue({
        el: '#root',
        data() {
            const page = chrome.runtime.getURL('options.html');
            return {
                options: page,
                runners: [],
            };
        },
        mounted() {
            const bgWindow = chrome.extension.getBackgroundPage();
            const start = bgWindow.start;
            this.runners = bgWindow.runners || [];
            chrome.runtime.onMessage.addListener((request) => {
                console.log('popup receive message', request);
                const { command } = request;
                if (command === 'restart') {
                    start((runners) => {
                        this.runners = runners;
                    });
                }
            });
        },
        methods: {
            switchStatus(runner) {
                if (runner.status) {
                    runner.stop();
                } else {
                    runner.start();
                }
            },
        },
    });
});
