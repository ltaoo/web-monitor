/**
 *
 * @param {Object} prevData - 旧数据
 * @param {Object} nextData - 新数据
 */
function compare(prevData, nextData) {
    if (prevData[0].title !== nextData[0].title) {
        return true;
    }
    return false;
}

function ready() {
    const { href } = location;
    if (!href.includes('github')) {
        return;
    }
    let called = 0;
    let data = null;
    let num = null;
    function fetchPage() {
        called += 1;
        console.log('called', called);
        fetch('/dashboard-feed')
            .then(res => res.text())
            .then((html) => {
                const $dom = $(html);
                const $container = $dom;
                const children = $container.children();
                console.log(children.length, num);
                if (num !== null && children.length !== num) {
                    console.log('有增加');
                    const url = 'https://api.telegram.org/bot741609465:AAH_UejPGr6nHtZBhDPmR0kvb_dxb1GtS4c/sendMessage?text=github有新内容&chat_id=862933116';
                    fetch(url);
                } else {
                    console.log('没有增加');
                }
                num = children.length;
                // 将 html 格式化为标准数据
                const cards = $container.children('div');
                const tempData = {};
                for (let i = 0, l = cards.length; i < l; i += 1) {
                    const $card = $(cards[i]);
                    const title = $card.find('a[class="link-gray-dark no-underline text-bold wb-break-all d-inline-block"]').text();
                    const user = $card.find('.avatar').attr('alt');
                    const content = $card.find('.f4').text();
                    tempData[i] = {
                        title: title.replace(/\s/g, '').replace(/↵/g, ''),
                        user,
                        content: content.replace(/\s/g, '').replace(/↵/g, ''),
                    };
                }
                console.log(data, tempData);
                // 如果有变化
                if (data !== null && compare(data, tempData)) {
                    console.log('内容有更新');
                    const url = 'https://api.telegram.org/bot741609465:AAH_UejPGr6nHtZBhDPmR0kvb_dxb1GtS4c/sendMessage?text=github有新内容&chat_id=862933116';
                    fetch(url);
                }
                data = tempData;
                setTimeout(() => {
                    fetchPage();
                }, 3000);
            })
            .catch((err) => {
                console.log('error', err);
                const url = 'https://api.telegram.org/bot741609465:AAH_UejPGr6nHtZBhDPmR0kvb_dxb1GtS4c/sendMessage?text=fetch github failed&chat_id=862933116';
                fetch(url);
                return fetchPage();
            });
    }
    // fetchPage();
}

document.addEventListener('DOMContentLoaded', ready);
