define(() => {
    const githubConfig = {
        page: 'https://github.com/',
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
    };

    const weiboConfig = {
        limit: '100',
        notifyCode: "const { addedNodes, updatedNodes, removedNodes } = updates;\nconst infos = addedNodes.map(node => {\n    return {\n        title: '微博有更新',\n        message: node.title + '有更新',\n    };\n});\nreturn infos;",
        page: 'https://m.weibo.cn/?sudaref=login.sina.com.cn',
        parserCode: 'const json = html;\nconst data = json.data;\nconst statuses = data. statuses;\n\nreturn statuses.map(item => {\n    return {\n        key: item.id,\ntitle: item.user. screen_name,\nmessage: item.text,\n    };\n});',
        sleep: '5000',
        title: 'Weibo',
        type: 'json',
        url: 'https://m.weibo.cn/feed/friends?',
    };
    return {
        weiboConfig,
        githubConfig,
    };
});
