function showResult(children) {
    const keys = Object.keys(children);
    return keys.map((key) => {
        const child = children[key];
        return {
            key,
            title: child.title,
            message: child.message,
        };
    });
}
function translate(results) {
    return results.reduce((prev, item) => {
        const res = prev;
        const { key, ...rest } = item;
        res[key] = rest;
        return res;
    }, {});
}
/* eslint-disable no-unused-vars */
const vm = new Vue({
    el: '#root',
    data() {
        return {
            loading: false,
            form: {
                url: 'https://github.com/dashboard-feed',
                parserCode: `const $container = $(html);
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
        message: content,
    };
}
return state;`,
                type: 'text',
                sleep: 5000,
                notifyCode: `const info = [];
const { addedNodes, updatedNodes, removedNodes } = updates;
// 有新增内容
if (addedNodes.length) {
    const notification = {};
    notification.title = 'Github 有新增内容';
    notification.type = 'list';
    const items = addedNodes.map(node => {
        return {
            title: node.title,
            message: node.message,
        };
    });
    notification.message = 'hello';
    notification.items = items.slice(0, 4);
    info.push(notification);
}
return info;
`,
            },
            results: [],
            response: {},
            isMocking: false,
            mockData: [],
            visible: false,
            updates: '',
            infos: '',
        };
    },
    methods: {
        fetch() {
            const { url, parserCode, type } = this.$data.form;
            return new Promise((resolve, reject) => {
                this.loading = true;
                fetch(url)
                    .then(res => res[type]())
                    .then((content) => {
                        /* eslint-disable no-eval */
                        const func = eval(`
                        ;(function () {
                            function parser(html, { removeWhiteSpace }) {
                                ${parserCode}
                            }
                            return parser;
                        }())`);
                        const res = func(content, utils);
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            });
        },
        testFetchContent() {
            this.fetch()
                .then((res) => {
                    this.results = showResult(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        emptyResults() {
            this.results = [];
        },
        mockChildren() {
            this.isMocking = true;
            this.fetch()
                .then((res) => {
                    try {
                        console.log(res);
                        this.response = res;
                        this.results = showResult(res);
                        this.mockData = showResult(res);
                    } catch (err) {
                        console.log(err);
                    }
                })
                .catch((err) => {

                });
        },
        handleDelete(index, row) {
            const { mockData } = this.$data;
            this.mockData = mockData.filter(item => item.key !== row.key);
        },
        addChild() {
            this.mockData.unshift({});
        },
        compare() {
            const { notifyCode } = this.$data.form;
            const res = this.response;
            const creator = eval(`
            (function() {
                function foo(updates) {
                    ${notifyCode}
                }
                return foo;
            }());
            `);
            const prevChildren = translate(this.results);
            const nextChildren = translate(this.mockData);
            const { hasUpdate, ...updates } = diff(prevChildren, nextChildren);
            const infos = creator(updates);
            return {
                updates,
                infos,
            };
        },
        showCompareResult() {
            const { updates, infos } = this.compare();
            this.updates = JSON.stringify(updates, null, '\t');
            this.infos = JSON.stringify(infos, null, '\t');
            this.visible = true;
        },
        notify() {
            const { infos } = this.$data;
            JSON.parse(infos).forEach((info) => {
                notify(info);
            });
        },
    },
});
