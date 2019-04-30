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
            hooks: {
                beforeReq: '',
            },
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
            // 请求间隔时间
            sleep: null,
            // 请求限制次数
            limit: Infinity,
        },
    ],
};
/**
 * 将字符串中的空白和回车/换行符号去掉
 * @param {string} str - 要处理的字符串
 * @returns {string}
 */
function removeWhiteSpace(str) {
    return str.replace(/\s/g, '').replace(/↵/g, '');
}

const utils = {
    removeWhiteSpace,
};

/**
 * 新旧内容对比，参考 https://zhuanlan.zhihu.com/p/20346379
 * @param {Object} prevState
 * @param {Object} state
 * prevChildren = {
 *  a: {
 *      ket: 'a',
 *      title: 'a',
 *  },
 *  b: {
 *      key: 'b',
 *      title: 'b',
 *  }
 * }
 * nextChildren = {
 *  c: {
 *      key: 'c',
 *      title: 'c',
 *  }
 *  a: {
 *      key: 'a',
 *      title: 'a',
 *  },
 *  b: {
 *      key: 'b',
 *      title: 'b',
 *  },
 * }
 */
function diff(prevChildren, nextChildren) {
    // 移除的节点
    const removedNodes = {};
    // 新增的节点
    const addedNodes = {};
    // 更新的节点
    const updatedNodes = {};
    let hasUpdate = false;
    // 首先对新集合的节点进行遍历循环
    Object.keys(nextChildren).forEach((name) => {
        const prevChild = prevChildren[name];
        const nextChild = nextChildren[name];
        // 如果 prevChildren 中存在 nextChildren 也存在的节点，说明是「移动」或者「更新」
        if (prevChild) {
            // 存在相同的节点，但不完全相同，说明是更新
            // 实际情况肯定不相等， nextChildren 每次都是新生成的，所以进行浅比较
            const keys = Object.keys(nextChild);
            const isEqual = keys.every(key => nextChild[key] === prevChild[key]);
            if (!isEqual) {
                hasUpdate = true;
                updatedNodes[name] = nextChild;
            }
        } else {
            // 不存在，说明是新增了一个节点
            hasUpdate = true;
            addedNodes[name] = nextChild;
        }
    });
    // 对老集合再次遍历
    Object.keys(prevChildren).forEach((name) => {
        // 如果在老集合中存在，新集合却不存在的节点，视为被删除
        if (
            prevChildren[name] && !nextChildren[name]
        ) {
            hasUpdate = true;
            removedNodes[name] = prevChildren[name];
        }
    });
    return {
        hasUpdate,
        addedNodes,
        updatedNodes,
        removedNodes,
    };
}

/* eslint-disable no-unused-vars */
const webhook = content => `https://api.telegram.org/bot741609465:AAH_UejPGr6nHtZBhDPmR0kvb_dxb1GtS4c/sendMessage?text=${content}&chat_id=862933116`;

/**
 *
 * @param {string} title
 * @param {Object} change
 */
function foo(title, change) {
    const res = [];
    const keys = Object.keys(change);
    if (keys.length) {
        keys.forEach((key) => {
            const data = change[key];
            res.push({
                title,
                content: data.title,
            });
        });
    }
    return res;
}
function dispatch({ addedNodes, removedNodes, updatedNodes }) {
    let info = [];
    info = info.concat(foo('Jira 有更新 - 新增', addedNodes));
    info = info.concat(foo('Jira 有更新 - 移除', removedNodes));
    info = info.concat(foo('Jira 有更新 - 更新', updatedNodes));
    for (let i = 0, l = info.length; i < l; i += 1) {
        const item = info[i];
        const { title, content } = item;
        chrome.runtime.sendMessage({
            title,
            message: content,
        });
    }
}

/**
 * @param {string} - 请求地址 @TODO 需要验证有效性
 * @param {function} - 获取格式化数据，由用户根据页面自定义
 */
function fetchContent({ url, parser, type = 'text', sleep = 5000, limit = Infinity }) {
    let times = 0;
    let prevChildren = null;
    function run() {
        if (times > limit) {
            return;
        }
        times += 1;
        console.log('fetch times', times);
        fetch(url)
            .then(res => res[type]())
            .then((content) => {
                const nextChildren = parser(content, utils);
                console.log(prevChildren, nextChildren);
                if (prevChildren !== null) {
                    const { hasUpdate, ...updates } = diff(prevChildren, nextChildren);
                    if (hasUpdate) {
                        console.log('has update');
                        dispatch(updates);
                    }
                }
                prevChildren = nextChildren;
                if (sleep) {
                    setTimeout(() => {
                        run();
                    }, sleep);
                } else {
                    run();
                }
            })
            .catch((err) => {
                console.log(err);
                run();
            });
    }
    run();
}

function pug(url, params) {
    let requestUrl = url;
    const args = {};
    if (params) {
        Object.keys(params).forEach((key) => {
            /* eslint-disable no-eval */
            args[key] = eval(params[key]);
        });
        requestUrl = Mustache.render(url, args);
    }
    return requestUrl;
}

document.addEventListener('DOMContentLoaded', () => {
    const { webs } = globalConfig;
    for (let i = 0, l = webs.length; i < l; i += 1) {
        const web = webs[i];
        const {
            url,
            reqUrl,
            reqParams,
            parser,
            contentType,
            sleep,
            limit,
        } = web;
        /* eslint-disable no-eval */
        const func = eval(parser);
        const path = pug(reqUrl, reqParams);
        if (location.href === url) {
            fetchContent({
                url: path,
                parser: func,
                sleep,
                limit,
                type: contentType,
            });
        }
    }
});
