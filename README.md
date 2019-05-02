# web-monitor

页面监控，由于一些系统不提供`webhook`，只能自己抓取页面分析是否有变动，并以 notification 或者 webhook 的形式通知。

## Usage

下载解压，在`Chrome`插件页面打开开发者模式，加载即可。
加载成功后先进入配置页增加配置项，默认提供三个

- Github
- Juejin
- Weibo

页面最下方「获取配置列表」，会读取该仓库中`configs`文件夹下的配置。点击添加后数据会填充到上方表单中，可以对信息进行修改，修改完成后点击「保存配置」即可。

点击图标，打开开关即可开始抓取页面。

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

### parserCode - 解析规则

默认会得到`html`变量，该变量在`type === text`时为`string`，`type === json`时为`object`。
必须要返回数组，并且该数组中对象必须包含`key`、`title`和`message`三个字段。

`key` 字段用来标志该信息的唯一性，判断是更新还是新增。假设存在如下新闻列表：

```js
{
    key: '001',
    title: '今日有雨',
    message: '经预测今天有雨',
},
{
    key: '002',
    title: '新闻列表002',
    message: '新闻列表',
},
```

后来发现错误了，将数据修改为：

```js
{
    key: '001',
    title: '今日是晴天',
    message: '经预测今天是晴天',
},
{
    key: '002',
    title: '新闻列表002',
    message: '新闻列表',
},
```

如果用户只关心新增内容，这种情况判断是「更新了页面」，就不会得到通知，除非新闻列表是变成了：

```js
{
    key: '003',
    title: '今日是晴天',
    message: '经预测今天是晴天',
},
{
    key: '002',
    title: '新闻列表002',
    message: '新闻列表',
},
```

### notifyCode 通知规则

一旦页面发生变更（更新新增或删除），就会根据通知规则生成通知内容。
默认会得到`updates`变量，有`addedNodes`、`updatedNodes`和`removedNodes`三个`key`，对应的值类型都是数组。
用户需要从这些变更中筛选出自己关注的内容，组装成通知内容并返回。返回结果必须是数组，每个元素都会发出一条通知。

```js
// 无论什么变更、变更数量多少，都只发一条通知
const { addedNodes, updatedNodes, removedNodes } = updates;
const notifications = [];
if (addedNodes.length > 0 || updatedNodes.length > 0 || removedNodes.length > 0) {
    notifications.push({
        title: '那个网站更新啦',
        message: '更新内容自己去看啦!',
    });
}
return notifications;
```

```js
// 根据变更类型发通知，并且每条变更都发一条通知。
const { addedNodes, updatedNodes, removedNodes } = updates;
const notifications = [];
if (addedNodes.length > 0) {
    notifications.push(...addedNodes.map((node) => {
        return {
            title: '那个网站有新内容',
            message: '新增' + node.title,
        };
    }));
}
if (updatedNodes.length > 0) {
    notifications.push(...addedNodes.map((node) => {
        return {
            title: '那个网站更新了已有内容',
            message: '更新记录' + node.title,
        };
    }));
}
if (removedNodes.length > 0) {
    notifications.push(...addedNodes.map((node) => {
        return {
            title: '那个网站删除了内容',
            message: '删除了' + node.title,
        };
    }));
}
return notifications;
```

## 问题

由于使用了 `eval`，所有可以输入代码的地方都是很危险的，所以绝对不能使用别人给的代码。