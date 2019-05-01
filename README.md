# web-monitor

页面监控，由于一些系统不提供`webhook`，只能自己抓取页面分析是否有变动。需要用户指定页面的规则，无法做到更友好的方式。

希望能做到的是，用户配置 url - rule 对应关系，这个 rule 是一段代码，在 url 匹配到时，就会不停去调用 rule，如果有不同，则利用 hook 去做通知，webhook 或者 notification。

所以这个`rule`要怎么制定就比较困难，既要有通用性，又要考虑特殊情况。

## 用例

### 1、固定 DOM 节点内容

假设是部署页面，页面上是当前任务的状态，初始为 pending，监控到为 success 就发通知并结束。
通知内容可以简单一些，这个也需要支持配置。

### 2、固定 DOM 内列表

JIRA 的 dashboard 会显示当前用户的 issue，如果有新增 issue ，就通知；issue 有变更也通知，并一直处于查询状态。
通知的内容也可以定制，可以详细一些，不只是「xxx有更新」这种无意义的提示。

### 3、新增 DOM or 不确定 DOM ？


## chrome extension 开发记录

### storage

```js
chrome.storage.sync.set({ key1: 'key1 content' }, (data) => {
    console.log(data); // undefined
});
chrome.storage.sync.get('key1', (data) => {
    console.log(data); // { key1: 'key1 content' }
});
```

```js
chrome.storage.sync.set({
    key1: 'key1 changed content',
    key2: 'key2 content',
}, (data) => {
    console.log(data); // undefined
});
chrome.storage.sync.get('key1', (data) => {
    console.log(data); // { key1: 'key1 changed content' }
});
chrome.storage.sync.get(['key1', 'key2'], (data) => {
    console.log(data); // { key1: 'key1 changed content', key2: 'key2 content' }
});
```

就是以`JSON`形式保存数据，所以`undefined`、`function`等都无法保存。并且可以注意到，`get`方法由于必须传`key`来获取数据，所以是无法获取到「所有」数据的。

## 使用说明

### parserCode

默认会得到`html`变量，该变量在`type === text`时为`string`，`type === json`时为`object`。

## 问题

由于使用了 `eval`，所有可以输入代码的地方都是很危险的，所以绝对不能使用别人给的代码。