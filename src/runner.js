/**
 * 将字符串中的空白和回车/换行符号去掉
 * @param {string} str - 要处理的字符串
 * @returns {string}
 */
function removeWhiteSpace(str) {
    return str.replace(/\s/g, '').replace(/↵/g, '');
}

/**
 * 模板字符串
 * @param {string} template - 要渲染数据的字符串，如 hello {{name}}
 * @param {Object} params - 要渲染的数据，如 { name: 'world' }
 * @return {string} 渲染完成的字符串
 */
function render(template, params) {
    return Mustache.render(template, params);
}

function preDiff(children) {
    return children.reduce((prev, item) => {
        const res = prev;
        res[item.key] = item;
        return res;
    }, {});
}

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
    const removedNodes = [];
    // 新增的节点
    const addedNodes = [];
    // 更新的节点
    const updatedNodes = [];
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
                updatedNodes.push(nextChild);
            }
        } else {
            // 不存在，说明是新增了一个节点
            hasUpdate = true;
            addedNodes.push(nextChild);
        }
    });
    // 对老集合再次遍历
    Object.keys(prevChildren).forEach((name) => {
        // 如果在老集合中存在，新集合却不存在的节点，视为被删除
        if (
            prevChildren[name] && !nextChildren[name]
        ) {
            hasUpdate = true;
            removedNodes.push(prevChildren[name]);
        }
    });
    return {
        hasUpdate,
        addedNodes,
        updatedNodes,
        removedNodes,
    };
}

const utils = {
    removeWhiteSpace,
    render,
    preDiff,
    diff,
};

/* eslint-disable no-unused-vars */
const webhook = content => `https://api.telegram.org/bot741609465:AAH_UejPGr6nHtZBhDPmR0kvb_dxb1GtS4c/sendMessage?text=${content}&chat_id=862933116`;

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

class Runner {
    /**
     * @param {string} page - 只在该页面运行
     * @param {string} url - 请求地址，如果不填则与 page 相同
     * @param {string} parserCode - 解析器代码
     * @param {string} notifyCode - 通知内容生成代码
     * @param {string} [title] - 该配置标题
     * @param {string} [type=text] - 解析返回值类型，即 content-type
     * @param {number} [sleep=5000] - 请求间隔时间
     * @param {number} [limit=Infinity] - 请求次数限制
     */
    constructor({
        page,
        url,
        parserCode,
        notifyCode,
        title,
        type = 'text',
        sleep = 5000,
        limit = Infinity,
    }) {
        /* eslint-disable no-eval */
        const parser = eval(render(parserTemplate, { code: parserCode }));
        const creator = eval(render(creatorTemplate, { code: notifyCode }));

        this.options = {
            title,
            page,
            url,
            type,
            sleep,
            limit,

            parser,
            creator,
        };
    }

    /**
     * 开始轮询页面
     */
    start() {
        const { page } = this.options;
        if (location.href !== page) {
            return;
        }
        this.fetchContent();
    }

    /**
     * @param {string} - 请求地址 @TODO 需要验证有效性
     * @param {function} - 获取格式化数据，由用户根据页面自定义
     */
    fetchContent() {
        const { url, parser, type, sleep, limit } = this.options;
        const self = this;
        let times = 0;
        let errorCount = 0;
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
                    const nextChildren = preDiff(parser(content, utils));
                    console.log(prevChildren, nextChildren);
                    if (prevChildren !== null) {
                        const { hasUpdate, ...updates } = diff(prevChildren, nextChildren);
                        if (hasUpdate) {
                            console.log('has update');
                            self.dispatch(updates);
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
                    errorCount += 1;
                    if (errorCount > 3) {
                        notify({
                            title: `${self.options.title} - 错误提示`,
                            message: '请求错误次数太多，请检查后重启',
                        });
                        return;
                    }
                    run();
                });
        }
        run();
    }

    dispatch({ addedNodes, removedNodes, updatedNodes }) {
        const { creator } = this.options;
        /* eslint-disable no-eval */
        const infos = creator({ addedNodes, removedNodes, updatedNodes });
        for (let i = 0, l = infos.length; i < l; i += 1) {
            const item = infos[i];
            notify(item);
        }
    }
}

const parserTemplate = `;(function () {
    function parser(html, { removeWhiteSpace }) {
        {{{code}}}
    }
    return parser;
}())`;
const creatorTemplate = `;(function() {
    function creator(updates) {
        {{{code}}}
    }
    return creator;
}());`;
