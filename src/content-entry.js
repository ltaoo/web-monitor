/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/scripts/content.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/scripts/common/notify.js":
/*!**************************************!*\
  !*** ./src/scripts/common/notify.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (() => {\n    /**\n     * 发出通知，参数见 https://developers.chrome.com/extensions/richNotifications\n     * @param {string} [type=basic] - basic|image|list|progress\n     * @param {string} title\n     * @param {string} message\n     * @param {string} [iconUrl]\n     * @param {string} [imageUrl]\n     * @param {Array<Object>} [items]\n     */\n    function notify(params) {\n        chrome.runtime.sendMessage({ command: 'notify', params });\n    }\n\n    return notify;\n}).call(exports, __webpack_require__, exports, module),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n\n\n//# sourceURL=webpack:///./src/scripts/common/notify.js?");

/***/ }),

/***/ "./src/scripts/common/runner.js":
/*!**************************************!*\
  !*** ./src/scripts/common/runner.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./utils */ \"./src/scripts/common/utils.js\"), __webpack_require__(/*! ./template */ \"./src/scripts/common/template.js\"), __webpack_require__(/*! ./notify */ \"./src/scripts/common/notify.js\")], __WEBPACK_AMD_DEFINE_RESULT__ = ((utils, templates, notify) => {\n    const {\n        render,\n        preDiff,\n        diff,\n    } = utils;\n    const { parserTemplate, creatorTemplate } = templates;\n\n    class Runner {\n        /**\n         * @param {string} page - 只在该页面运行\n         * @param {string} url - 请求地址，如果不填则与 page 相同\n         * @param {string} parserCode - 解析器代码\n         * @param {string} notifyCode - 通知内容生成代码\n         * @param {string} [title] - 该配置标题\n         * @param {string} [type=text] - 解析返回值类型，即 content-type\n         * @param {number} [sleep=5000] - 请求间隔时间\n         * @param {number} [limit=Infinity] - 请求次数限制\n         */\n        constructor({\n            page,\n            url,\n            parserCode,\n            notifyCode,\n            title,\n            type = 'text',\n            sleep = 5000,\n            limit = Infinity,\n        }) {\n            /* eslint-disable no-eval */\n            const parser = eval(render(parserTemplate, { code: parserCode }));\n            const creator = eval(render(creatorTemplate, { code: notifyCode }));\n\n            this.options = {\n                title,\n                page,\n                url,\n                type,\n                sleep,\n                limit,\n\n                parser,\n                creator,\n            };\n        }\n\n        /**\n         * 开始轮询页面\n         */\n        start() {\n            const { page } = this.options;\n            if (location.href !== page) {\n                return;\n            }\n            this.fetchContent();\n        }\n\n        /**\n         * @param {string} - 请求地址 @TODO 需要验证有效性\n         * @param {function} - 获取格式化数据，由用户根据页面自定义\n         */\n        fetchContent() {\n            const { url, parser, type, sleep, limit } = this.options;\n            const self = this;\n            let times = 0;\n            let errorCount = 0;\n            let prevChildren = null;\n            function run() {\n                if (limit && times > limit) {\n                    return;\n                }\n                times += 1;\n                console.log('fetch times', times);\n                fetch(url, {\n                    headers: {\n                        'Access-Control-Allow-Origin': '*',\n                    },\n                })\n                    .then(res => res[type]())\n                    .then((content) => {\n                        const nextChildren = preDiff(parser(content, utils));\n                        console.log(prevChildren, nextChildren);\n                        if (prevChildren !== null) {\n                            const { hasUpdate, ...updates } = diff(prevChildren, nextChildren);\n                            if (hasUpdate) {\n                                console.log('has update');\n                                self.dispatch(updates);\n                            }\n                        }\n                        prevChildren = nextChildren;\n                        if (sleep) {\n                            setTimeout(() => {\n                                run();\n                            }, sleep);\n                        } else {\n                            run();\n                        }\n                    })\n                    .catch((err) => {\n                        console.log(err);\n                        errorCount += 1;\n                        if (errorCount > 3) {\n                            notify({\n                                title: `${self.options.title} - 错误提示`,\n                                message: '请求错误次数太多，请检查后重启',\n                            });\n                            return;\n                        }\n                        run();\n                    });\n            }\n            run();\n        }\n\n        dispatch({ addedNodes, removedNodes, updatedNodes }) {\n            const { creator } = this.options;\n            /* eslint-disable no-eval */\n            const infos = creator({ addedNodes, removedNodes, updatedNodes });\n            for (let i = 0, l = infos.length; i < l; i += 1) {\n                const item = infos[i];\n                notify(item);\n            }\n        }\n    }\n    return Runner;\n}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n\n\n//# sourceURL=webpack:///./src/scripts/common/runner.js?");

/***/ }),

/***/ "./src/scripts/common/template.js":
/*!****************************************!*\
  !*** ./src/scripts/common/template.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (() => {\n    const parserTemplate = `;(function () {\n        function parser(html, { removeWhiteSpace }) {\n            {{{code}}}\n        }\n        return parser;\n    }())`;\n    const creatorTemplate = `;(function() {\n        function creator(updates) {\n            {{{code}}}\n        }\n        return creator;\n    }());`;\n\n    const templates = {\n        parserTemplate,\n        creatorTemplate,\n    };\n\n    return templates;\n}).call(exports, __webpack_require__, exports, module),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n\n\n//# sourceURL=webpack:///./src/scripts/common/template.js?");

/***/ }),

/***/ "./src/scripts/common/utils.js":
/*!*************************************!*\
  !*** ./src/scripts/common/utils.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! Mustache */ \"./src/scripts/libs/mustache.min.js\")], __WEBPACK_AMD_DEFINE_RESULT__ = ((Mustache) => {\n    /**\n     * 将字符串中的空白和回车/换行符号去掉\n     * @param {string} str - 要处理的字符串\n     * @returns {string}\n     */\n    function removeWhiteSpace(str) {\n        return str.replace(/\\s/g, '').replace(/↵/g, '');\n    }\n\n    /**\n     * 模板字符串\n     * @param {string} template - 要渲染数据的字符串，如 hello {{name}}\n     * @param {Object} params - 要渲染的数据，如 { name: 'world' }\n     * @return {string} 渲染完成的字符串\n     */\n    function render(template, params) {\n        return Mustache.render(template, params);\n    }\n\n    function preDiff(children) {\n        return children.reduce((prev, item) => {\n            const res = prev;\n            res[item.key] = item;\n            return res;\n        }, {});\n    }\n\n    /**\n     * 新旧内容对比，参考 https://zhuanlan.zhihu.com/p/20346379\n     * @param {Object} prevState\n     * @param {Object} state\n     * prevChildren = {\n     *  a: {\n     *      ket: 'a',\n     *      title: 'a',\n     *  },\n     *  b: {\n     *      key: 'b',\n     *      title: 'b',\n     *  }\n     * }\n     * nextChildren = {\n     *  c: {\n     *      key: 'c',\n     *      title: 'c',\n     *  }\n     *  a: {\n     *      key: 'a',\n     *      title: 'a',\n     *  },\n     *  b: {\n     *      key: 'b',\n     *      title: 'b',\n     *  },\n     * }\n     */\n    function diff(prevChildren, nextChildren) {\n        // 移除的节点\n        const removedNodes = [];\n        // 新增的节点\n        const addedNodes = [];\n        // 更新的节点\n        const updatedNodes = [];\n        let hasUpdate = false;\n        // 首先对新集合的节点进行遍历循环\n        Object.keys(nextChildren).forEach((name) => {\n            const prevChild = prevChildren[name];\n            const nextChild = nextChildren[name];\n            // 如果 prevChildren 中存在 nextChildren 也存在的节点，说明是「移动」或者「更新」\n            if (prevChild) {\n                // 存在相同的节点，但不完全相同，说明是更新\n                // 实际情况肯定不相等， nextChildren 每次都是新生成的，所以进行浅比较\n                const keys = Object.keys(nextChild);\n                const isEqual = keys.every(key => nextChild[key] === prevChild[key]);\n                if (!isEqual) {\n                    hasUpdate = true;\n                    updatedNodes.push(nextChild);\n                }\n            } else {\n                // 不存在，说明是新增了一个节点\n                hasUpdate = true;\n                addedNodes.push(nextChild);\n            }\n        });\n        // 对老集合再次遍历\n        Object.keys(prevChildren).forEach((name) => {\n            // 如果在老集合中存在，新集合却不存在的节点，视为被删除\n            if (\n                prevChildren[name] && !nextChildren[name]\n            ) {\n                hasUpdate = true;\n                removedNodes.push(prevChildren[name]);\n            }\n        });\n        return {\n            hasUpdate,\n            addedNodes,\n            updatedNodes,\n            removedNodes,\n        };\n    }\n\n    const utils = {\n        removeWhiteSpace,\n        render,\n        preDiff,\n        diff,\n    };\n\n    return utils;\n}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n\n\n//# sourceURL=webpack:///./src/scripts/common/utils.js?");

/***/ }),

/***/ "./src/scripts/content.js":
/*!********************************!*\
  !*** ./src/scripts/content.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./common/runner */ \"./src/scripts/common/runner.js\")], __WEBPACK_AMD_DEFINE_RESULT__ = ((Runner) => {\n    document.addEventListener('DOMContentLoaded', () => {\n        chrome.storage.sync.get('webs', ({ webs = [] }) => {\n            console.log(webs);\n            for (let i = 0, l = webs.length; i < l; i += 1) {\n                const config = webs[i];\n                const runner = new Runner(config);\n                runner.start();\n            }\n        });\n    });\n}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n\n\n//# sourceURL=webpack:///./src/scripts/content.js?");

/***/ }),

/***/ "./src/scripts/libs/mustache.min.js":
/*!******************************************!*\
  !*** ./src/scripts/libs/mustache.min.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function defineMustache(global,factory){if( true&&exports&&typeof exports.nodeName!==\"string\"){factory(exports)}else if(true){!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?\n\t\t\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))}else{}})(this,function mustacheFactory(mustache){var objectToString=Object.prototype.toString;var isArray=Array.isArray||function isArrayPolyfill(object){return objectToString.call(object)===\"[object Array]\"};function isFunction(object){return typeof object===\"function\"}function typeStr(obj){return isArray(obj)?\"array\":typeof obj}function escapeRegExp(string){return string.replace(/[\\-\\[\\]{}()*+?.,\\\\\\^$|#\\s]/g,\"\\\\$&\")}function hasProperty(obj,propName){return obj!=null&&typeof obj===\"object\"&&propName in obj}function primitiveHasOwnProperty(primitive,propName){return primitive!=null&&typeof primitive!==\"object\"&&primitive.hasOwnProperty&&primitive.hasOwnProperty(propName)}var regExpTest=RegExp.prototype.test;function testRegExp(re,string){return regExpTest.call(re,string)}var nonSpaceRe=/\\S/;function isWhitespace(string){return!testRegExp(nonSpaceRe,string)}var entityMap={\"&\":\"&amp;\",\"<\":\"&lt;\",\">\":\"&gt;\",'\"':\"&quot;\",\"'\":\"&#39;\",\"/\":\"&#x2F;\",\"`\":\"&#x60;\",\"=\":\"&#x3D;\"};function escapeHtml(string){return String(string).replace(/[&<>\"'`=\\/]/g,function fromEntityMap(s){return entityMap[s]})}var whiteRe=/\\s*/;var spaceRe=/\\s+/;var equalsRe=/\\s*=/;var curlyRe=/\\s*\\}/;var tagRe=/#|\\^|\\/|>|\\{|&|=|!/;function parseTemplate(template,tags){if(!template)return[];var sections=[];var tokens=[];var spaces=[];var hasTag=false;var nonSpace=false;function stripSpace(){if(hasTag&&!nonSpace){while(spaces.length)delete tokens[spaces.pop()]}else{spaces=[]}hasTag=false;nonSpace=false}var openingTagRe,closingTagRe,closingCurlyRe;function compileTags(tagsToCompile){if(typeof tagsToCompile===\"string\")tagsToCompile=tagsToCompile.split(spaceRe,2);if(!isArray(tagsToCompile)||tagsToCompile.length!==2)throw new Error(\"Invalid tags: \"+tagsToCompile);openingTagRe=new RegExp(escapeRegExp(tagsToCompile[0])+\"\\\\s*\");closingTagRe=new RegExp(\"\\\\s*\"+escapeRegExp(tagsToCompile[1]));closingCurlyRe=new RegExp(\"\\\\s*\"+escapeRegExp(\"}\"+tagsToCompile[1]))}compileTags(tags||mustache.tags);var scanner=new Scanner(template);var start,type,value,chr,token,openSection;while(!scanner.eos()){start=scanner.pos;value=scanner.scanUntil(openingTagRe);if(value){for(var i=0,valueLength=value.length;i<valueLength;++i){chr=value.charAt(i);if(isWhitespace(chr)){spaces.push(tokens.length)}else{nonSpace=true}tokens.push([\"text\",chr,start,start+1]);start+=1;if(chr===\"\\n\")stripSpace()}}if(!scanner.scan(openingTagRe))break;hasTag=true;type=scanner.scan(tagRe)||\"name\";scanner.scan(whiteRe);if(type===\"=\"){value=scanner.scanUntil(equalsRe);scanner.scan(equalsRe);scanner.scanUntil(closingTagRe)}else if(type===\"{\"){value=scanner.scanUntil(closingCurlyRe);scanner.scan(curlyRe);scanner.scanUntil(closingTagRe);type=\"&\"}else{value=scanner.scanUntil(closingTagRe)}if(!scanner.scan(closingTagRe))throw new Error(\"Unclosed tag at \"+scanner.pos);token=[type,value,start,scanner.pos];tokens.push(token);if(type===\"#\"||type===\"^\"){sections.push(token)}else if(type===\"/\"){openSection=sections.pop();if(!openSection)throw new Error('Unopened section \"'+value+'\" at '+start);if(openSection[1]!==value)throw new Error('Unclosed section \"'+openSection[1]+'\" at '+start)}else if(type===\"name\"||type===\"{\"||type===\"&\"){nonSpace=true}else if(type===\"=\"){compileTags(value)}}openSection=sections.pop();if(openSection)throw new Error('Unclosed section \"'+openSection[1]+'\" at '+scanner.pos);return nestTokens(squashTokens(tokens))}function squashTokens(tokens){var squashedTokens=[];var token,lastToken;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];if(token){if(token[0]===\"text\"&&lastToken&&lastToken[0]===\"text\"){lastToken[1]+=token[1];lastToken[3]=token[3]}else{squashedTokens.push(token);lastToken=token}}}return squashedTokens}function nestTokens(tokens){var nestedTokens=[];var collector=nestedTokens;var sections=[];var token,section;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];switch(token[0]){case\"#\":case\"^\":collector.push(token);sections.push(token);collector=token[4]=[];break;case\"/\":section=sections.pop();section[5]=token[2];collector=sections.length>0?sections[sections.length-1][4]:nestedTokens;break;default:collector.push(token)}}return nestedTokens}function Scanner(string){this.string=string;this.tail=string;this.pos=0}Scanner.prototype.eos=function eos(){return this.tail===\"\"};Scanner.prototype.scan=function scan(re){var match=this.tail.match(re);if(!match||match.index!==0)return\"\";var string=match[0];this.tail=this.tail.substring(string.length);this.pos+=string.length;return string};Scanner.prototype.scanUntil=function scanUntil(re){var index=this.tail.search(re),match;switch(index){case-1:match=this.tail;this.tail=\"\";break;case 0:match=\"\";break;default:match=this.tail.substring(0,index);this.tail=this.tail.substring(index)}this.pos+=match.length;return match};function Context(view,parentContext){this.view=view;this.cache={\".\":this.view};this.parent=parentContext}Context.prototype.push=function push(view){return new Context(view,this)};Context.prototype.lookup=function lookup(name){var cache=this.cache;var value;if(cache.hasOwnProperty(name)){value=cache[name]}else{var context=this,intermediateValue,names,index,lookupHit=false;while(context){if(name.indexOf(\".\")>0){intermediateValue=context.view;names=name.split(\".\");index=0;while(intermediateValue!=null&&index<names.length){if(index===names.length-1)lookupHit=hasProperty(intermediateValue,names[index])||primitiveHasOwnProperty(intermediateValue,names[index]);intermediateValue=intermediateValue[names[index++]]}}else{intermediateValue=context.view[name];lookupHit=hasProperty(context.view,name)}if(lookupHit){value=intermediateValue;break}context=context.parent}cache[name]=value}if(isFunction(value))value=value.call(this.view);return value};function Writer(){this.cache={}}Writer.prototype.clearCache=function clearCache(){this.cache={}};Writer.prototype.parse=function parse(template,tags){var cache=this.cache;var cacheKey=template+\":\"+(tags||mustache.tags).join(\":\");var tokens=cache[cacheKey];if(tokens==null)tokens=cache[cacheKey]=parseTemplate(template,tags);return tokens};Writer.prototype.render=function render(template,view,partials,tags){var tokens=this.parse(template,tags);var context=view instanceof Context?view:new Context(view);return this.renderTokens(tokens,context,partials,template,tags)};Writer.prototype.renderTokens=function renderTokens(tokens,context,partials,originalTemplate,tags){var buffer=\"\";var token,symbol,value;for(var i=0,numTokens=tokens.length;i<numTokens;++i){value=undefined;token=tokens[i];symbol=token[0];if(symbol===\"#\")value=this.renderSection(token,context,partials,originalTemplate);else if(symbol===\"^\")value=this.renderInverted(token,context,partials,originalTemplate);else if(symbol===\">\")value=this.renderPartial(token,context,partials,tags);else if(symbol===\"&\")value=this.unescapedValue(token,context);else if(symbol===\"name\")value=this.escapedValue(token,context);else if(symbol===\"text\")value=this.rawValue(token);if(value!==undefined)buffer+=value}return buffer};Writer.prototype.renderSection=function renderSection(token,context,partials,originalTemplate){var self=this;var buffer=\"\";var value=context.lookup(token[1]);function subRender(template){return self.render(template,context,partials)}if(!value)return;if(isArray(value)){for(var j=0,valueLength=value.length;j<valueLength;++j){buffer+=this.renderTokens(token[4],context.push(value[j]),partials,originalTemplate)}}else if(typeof value===\"object\"||typeof value===\"string\"||typeof value===\"number\"){buffer+=this.renderTokens(token[4],context.push(value),partials,originalTemplate)}else if(isFunction(value)){if(typeof originalTemplate!==\"string\")throw new Error(\"Cannot use higher-order sections without the original template\");value=value.call(context.view,originalTemplate.slice(token[3],token[5]),subRender);if(value!=null)buffer+=value}else{buffer+=this.renderTokens(token[4],context,partials,originalTemplate)}return buffer};Writer.prototype.renderInverted=function renderInverted(token,context,partials,originalTemplate){var value=context.lookup(token[1]);if(!value||isArray(value)&&value.length===0)return this.renderTokens(token[4],context,partials,originalTemplate)};Writer.prototype.renderPartial=function renderPartial(token,context,partials,tags){if(!partials)return;var value=isFunction(partials)?partials(token[1]):partials[token[1]];if(value!=null)return this.renderTokens(this.parse(value,tags),context,partials,value)};Writer.prototype.unescapedValue=function unescapedValue(token,context){var value=context.lookup(token[1]);if(value!=null)return value};Writer.prototype.escapedValue=function escapedValue(token,context){var value=context.lookup(token[1]);if(value!=null)return mustache.escape(value)};Writer.prototype.rawValue=function rawValue(token){return token[1]};mustache.name=\"mustache.js\";mustache.version=\"3.0.1\";mustache.tags=[\"{{\",\"}}\"];var defaultWriter=new Writer;mustache.clearCache=function clearCache(){return defaultWriter.clearCache()};mustache.parse=function parse(template,tags){return defaultWriter.parse(template,tags)};mustache.render=function render(template,view,partials,tags){if(typeof template!==\"string\"){throw new TypeError('Invalid template! Template should be a \"string\" '+'but \"'+typeStr(template)+'\" was given as the first '+\"argument for mustache#render(template, view, partials)\")}return defaultWriter.render(template,view,partials,tags)};mustache.to_html=function to_html(template,view,partials,send){var result=mustache.render(template,view,partials);if(isFunction(send)){send(result)}else{return result}};mustache.escape=escapeHtml;mustache.Scanner=Scanner;mustache.Context=Context;mustache.Writer=Writer;return mustache});\n\n\n//# sourceURL=webpack:///./src/scripts/libs/mustache.min.js?");

/***/ })

/******/ });