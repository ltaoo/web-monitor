const globalConfig = {
    webs: [
        {
            // 请求地址，如果与 url 不同则？
            reqUrl: 'https://github.com/dashboard-feed?_={{time}}',
            // 请求中需要附加的参数
            reqParams: {
                time: ';(function() {return Date.now();}())',
            },
            contentType: 'text',
            url: 'https://github.com/',
            parser: `
            /**
             * @param {string} - 请求指定 url 得到的结果
             * @param {function} - 回调，当需要通知时调用并传入通知内容
             * @returns {Object} - 返回用来比较的数据
             */
            ;(function () {
                function parser(html, { removeWhiteSpace }) {
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
                }
                return parser;
            }())`,
        },
    ],
};
document.addEventListener('DOMContentLoaded', () => {
    const { webs } = globalConfig;
    for (let i = 0, l = webs.length; i < l; i += 1) {
        const config = webs[i];
        const { url, parserCode, reqUrl, reqParams } = config;
        /* eslint-disable no-eval */
        const parser = eval(parserCode);
        const path = pug(reqUrl, reqParams);
        if (location.href === url) {
            fetchContent({
                ...config,
                url: path,
                parser,
            });
        }
    }
});
