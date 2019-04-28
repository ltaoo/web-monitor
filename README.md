# min-boilerplate

简单的插件模板，没有框架，没有编译打包。

## chrome 拓展可以做什么？

## mainfest

### 背景页

`persistent`定义了常驻后台的方式
- true，一直在后台运行
- false，按需运行 Event page

## 基本

可以有四个地方执行代码

- tab   (main.html)
- popup     (popup.html)
- options   (options.html)
- content   (background.js)

### tab

可以覆盖 new tab，不需要则在`mainfest.json`删除该配置。

```
"chrome_url_overrides": {
  "newtab": "main.html"
},
```

### popup

点击图标出现的内容区。
需要给定 body 宽度

### options

右键图标 -> 选项 跳转的页面，主要是配置该拓展的设置，只有当指定`optins_page`属性才会有。

### content

在页面中执行代码，配置在每个页面都执行。

### 通信

- runtime.sendMessage
- runtime.onMessage
- runtime.connect
- runtime.onConnect

### 存储



### 网络请求

### 右键菜单

`permissions` 中增加

```
"contextMenus"
```

同时指定16x16图标

```javascript
chrome.contextMenus.create({
    type: 'normal',
    title: 'Menu A',
    id: 'a',
});
```

还可以配置在何种情况下显示菜单:

- all
- page
- frame
- selection
- link
- editable
- image
- video
- audio
- launcher

甚至限制在特定网站有自定义菜单。

参考 - [Context Menus](http://open.chrome.360.cn/extension_dev/contextMenus.html)

### 桌面提醒

```javascript
const notification = webkitNotifications.createNotification(
    'icon48.png',
    'Notification Demo',
    'Merry Christmas',
);

notification.show();
```

### omnibox

浏览器开放了地址栏的权限。

### 书签

在`permisson`加入`bookmarks`后就可以操作书签了。

```javascript
chrome.bookmarks.getTree(function (bookmarkArray) {
    console.log(bookmarkArray)
});
```

- [bookmarks](https://developer.chrome.com/extensions/bookmarks)

### tabs

是否可以编译后自动刷新拓展页，不用手动刷新了。

```javascript
chrome.tabs.reload(tabId, {
    bypassCache: true,
}, function () {
    console.log('Tab has been reloaded');
});
```

向指定标签注入脚本和样式。

```
chrome.tabs.executeScript(tabId, {

```

- [tabs](https://developer.chrome.com/extensions/tabs)

## 项目结构

还是准备用`vue`作为前端框架，`iview`作为`ui`库，但是考虑到打包后的体积，尽可能做优化吧。

## 调试方法

## 动态改变图标

```javascript
chrome.browserAction.setIcon({path: 'img/' + (status ? 'online' : 'offline')});
```

只是调用了`setIcon`方法即可。还可以`setTitle`改变标题。

`Badg`，显示在图标上的文本，只有 4 字节长度。

```javascript
chrome.browserAction.setBadgeBackgroundColor({ color: '#fff' });
chrome.browserAction.setBadgeText({ text: 'hello' });
```


## 魔改其他插件

```bash
~/Library/Application Support/Google/Chrome/Default/Extensions
```
存放了安装的`chrome`拓展，找到对应的`id`即可，但可惜大部分拓展都是压缩后的。

