document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get('webs', ({ webs = [] }) => {
        console.log(webs);
        for (let i = 0, l = webs.length; i < l; i += 1) {
            const config = webs[i];
            const runner = new Runner(config);
            runner.start();
        }
    });
});
