/**
 * @file github 页面监控规则
 */

/**
 * @param {string} - 请求指定 url 得到的结果
 * @param {function} - 回调，当需要通知时调用并传入通知内容
 * @returns {Object} - 返回用来比较的数据
 */
function rule(html) {
    const $dom = $(html);
    const $container = $dom;

    const children = $container.children();
    const { length } = children;
    const cards = $container.children('div');
    const items = [];
    for (let i = 0, l = cards.length; i < l; i += 1) {
        const $card = $(cards[i]);
        const title = $card.find('a[class="link-gray-dark no-underline text-bold wb-break-all d-inline-block"]').text();
        // const user = $card.find('.avatar').attr('alt');
        const content = $card.find('.f4').text();
        items.push({
            key: i,
            title: title.replace(/\s/g, '').replace(/↵/g, ''),
            // user,
            content: content.replace(/\s/g, '').replace(/↵/g, ''),
        });
    }
    return {
        length,
        items,
    };
}
