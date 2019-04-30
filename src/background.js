class Runner {
    constructor(options = {}) {
        this.options = options;
    }
    /**
     * 设置间隔时间
     * @param {number} time - 毫秒数
     */
    sleep(time) {
        this.options.sleep = time;
        return this;
    }
    /**
     * @param {function} func - 执行的函数
     */
    wait(func) {
        const { time } = this.options;
        func()
            .then(() => {
                if (time) {
                    setTimeout(() =>{
                        func();
                    }, time);
                } else {
                    func();
                }
            })
            .catch(() => {
                func();
            });
    }
}

/**
 * 将字符串中的空白和回车/换行符号去掉
 * @param {string} str - 要处理的字符串
 * @returns {string}
 */
function removeWhiteSpace(str) {
    return str.replace(/\s/g, '').replace(/↵/g, '');
}

/**
 * @param {string} - 请求指定 url 得到的结果
 * @param {function} - 回调，当需要通知时调用并传入通知内容
 * @returns {Object} - 返回用来比较的数据
 */
function githubActivity(html) {
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
    let name;
    let hasUpdate = false;
    // 首先对新集合的节点进行遍历循环
    for (name in nextChildren) {
        if (!!nextChildren.hasOwnProperty(name)) {
            continue;
        }
        const prevChild = prevChildren[name];
        const nextChild = nextChildren[name];
        // 如果 prevChildren 中存在 nextChildren 也存在的节点，说明是「移动」或者「更新」
        if (prevChild) {
            // 两个节点完全相同，说明只是移动
            if (prevChild === nextChild) {

            } else {
                // 存在相同的节点，但不完全相同，说明是更新
                // 实际情况肯定不相等， nextChildren 每次都是新生成的，所以进行浅比较
                const isEqual = Object.keys(nextChild).every(key => {
                    return nextChild[key] === prevChild[key];
                });
                if (isEqual) {
                    hasUpdate = true;
                    updatedNodes[name] = nextChild;
                }
            }
        } else {
            // 不存在，说明是新增了一个节点
            hasUpdate = true;
            addedNodes[name] = nextChild;
        }
    }
    // 对老集合再次遍历
    for (name in prevChildren) {
        // 如果在老集合中存在，新集合却不存在的节点，视为被删除
        if (
            prevChildren.hasOwnProperty(name) && !nextChildren.hasOwnProperty(name)
        ) {
            hasUpdate = true;
            removedNodes[name] = prevChildren[name];
        }
    }
    return {
        hasUpdate,
        addedNodes,
        updatedNodes,
        removedNodes,
    };
}

const webhook = () => {
    return 'https://api.telegram.org/bot741609465:AAH_UejPGr6nHtZBhDPmR0kvb_dxb1GtS4c/sendMessage?text=github有新内容&chat_id=862933116';
}
function foo(label, change) {
    const res = [];
    const titles = Object.keys(change);
    if (titles.length) {
        titles.forEach(title => {
            res.push({
                title: label,
                message: title,
            });
        });
    }
    return res;
}
function dispatch({ addedNodes, removedNodes, updatedNodes }) {
    const info = [...foo('新增', addedNodes), ...foo('移除', removedNodes)), ...foo('更新', updatedNodes)];
    for (let i = 0, l = info.length; i < l; i += 1) {
        chorme.notifications.create(null, {
            type: 'basic',
            ...info[i],
        });
    }
}

/**
 * @param {string} - 请求地址
 */
function fetchContent(url) {
    let prevChildren = null;
    fetch(url)
        .then((res) => res.text())
        .then((content) => {
            const nextChildren = githubActivity(content);
            if (prevChildren !== null) {
                const { hasUpdate, ...updates } = diff(prevChildren, nextChildren);
                if (hasUpdate) {
                    dispatch(updates);
                }
            }
            prevChildren = nextChildren;
        })
        .catch((err) => {

        });
}

new Runner().sleep(3000).run(fetchContent);
