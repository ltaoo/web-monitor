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
            return {
                runners: [],
            };
        },
        mounted() {
            const bgWindow = chrome.extension.getBackgroundPage();
            this.runners = bgWindow.runners;
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
