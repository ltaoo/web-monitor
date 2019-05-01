/* eslint-disable no-unused-vars, no-undef */
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
 *
 * @param {Json} content
 */
function jiraRule(response) {
    const { table } = response;
    const $container = $(table);
    const cards = $container.find('.issuerow');
    const state = {};
    for (let i = 0, l = cards.length; i < l; i += 1) {
        const $card = $(cards[i]);
        const key = $card.attr('rel');
        const titleSelector = '.summary a';
        const title = removeWhiteSpace($card.find(titleSelector).text());
        const content = $card.find('.issue-link').attr('href');
        state[key] = {
            title,
            content,
            href: content,
        };
    }
    return state;
}

