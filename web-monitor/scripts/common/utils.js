define(['Mustache'], (Mustache) => {
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

    return utils;
});
