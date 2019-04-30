/* eslint-disable no-unused-vars */
const vm = new Vue({
    el: '#root',
    data() {
        return {
            url: 'https://github.com/dashboard-feed',
            parser: `
            const $container = $(html);
            const cards = $container.children('div');
            const state = {};
            for (let i = 0, l = cards.length; i < l; i += 1) {
                const $card = $(cards[i]);
                const titleSelector = 'a[class="link-gray-dark no-underline text-bold wb-break-all d-inline-block"]';
                const title = removeWhiteSpace($card.find(titleSelector).text());
                const contentSelector = '.f4';
                const content = removeWhiteSpace($card.find(contentSelector).text());
                state[title] = {
                    title,
                    content,
                };
            }
            return state;
            `,
        };
    },
    methods: {
        testFetchContent() {
            const { url, parser } = this.$data;
            fetch(url)
                .then(res => res.text())
                .then((content) => {
                    /* eslint-disable no-eval */
                    const func = eval(`
                    ;(function () {
                        function parser(html, { removeWhiteSpace }) {
                            ${parser}
                        }
                        return parser;
                    }())`);
                    console.log(func);
                    const res = func(content, utils);
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
});
