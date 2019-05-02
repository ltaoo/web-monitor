define([
    '../libs/jquery.min',
    './utils',
    './template',
    './notify',
], ($, utils, templates, notify) => {
    const {
        render,
        preDiff,
        diff,
    } = utils;
    const { parserTemplate, creatorTemplate } = templates;

    class Runner {
        /**
         * @param {string} page - 只在该页面运行
         * @param {string} url - 请求地址，如果不填则与 page 相同
         * @param {string} parserCode - 解析器代码
         * @param {string} notifyCode - 通知内容生成代码
         * @param {string} [title] - 该配置标题
         * @param {string} [type=text] - 解析返回值类型，即 content-type
         * @param {number} [sleep=5000] - 请求间隔时间
         * @param {number} [limit=Infinity] - 请求次数限制
         */
        constructor(options) {
            const { parserCode, notifyCode, ...rest } = options;
            /* eslint-disable no-eval */
            const parser = eval(render(parserTemplate, { code: parserCode }));
            const creator = eval(render(creatorTemplate, { code: notifyCode }));

            this.options = {
                parser,
                creator,
                ...rest,
            };
        }

        /**
         * 开始轮询页面
         */
        start() {
            const { page } = this.options;
            if (location.href !== page) {
                return;
            }
            this.fetchContent();
        }

        /**
         * @param {string} - 请求地址 @TODO 需要验证有效性
         * @param {function} - 获取格式化数据，由用户根据页面自定义
         */
        fetchContent() {
            const {
                url,
                parser,
                type,
                method,
                body,
                sleep,
                limit,
            } = this.options;
            const self = this;
            let times = 0;
            let errorCount = 0;
            let prevChildren = null;
            console.log(this.options);
            function run() {
                if (limit && times > limit) {
                    return;
                }
                times += 1;
                const params = {};
                console.log('fetch times', times);
                if (method === 'POST') {
                    params.method = method;
                    params.headers = method === 'POST' && {
                        'Content-Type': 'application/json',
                        'X-Agent': 'Juejin/Web',
                        'X-Legacy-Device-Id': 1556769478440,
                        'X-Legacy-Token': 'eyJhY2Nlc3NfdG9rZW4iOiI5ZkdJMmZzUDZZTjJ1dHRjIiwicmVmcmVzaF90b2tlbiI6IkR4dzhpb1BPdUh2dmNGR1YiLCJ0b2tlbl90eXBlIjoibWFjIiwiZXhwaXJlX2luIjoyNTkyMDAwfQ==',
                        'X-Legacy-Uid': '574d9479a3413100592d330d',
                    };
                    params.body = body;
                }
                console.log('fetch params', params);
                fetch(url, params)
                    .then(res => res[type]())
                    .then((content) => {
                        const nextChildren = preDiff(parser(content, utils));
                        console.log(prevChildren, nextChildren);
                        if (prevChildren !== null) {
                            const { hasUpdate, ...updates } = diff(prevChildren, nextChildren);
                            if (hasUpdate) {
                                console.log('has update');
                                self.dispatch(updates);
                            }
                        }
                        prevChildren = nextChildren;
                        if (sleep) {
                            setTimeout(() => {
                                run();
                            }, sleep);
                        } else {
                            run();
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        errorCount += 1;
                        if (errorCount > 3) {
                            notify({
                                title: `${self.options.title} - 错误提示`,
                                message: '请求错误次数太多，请检查后重启',
                            });
                            return;
                        }
                        run();
                    });
            }
            run();
        }

        dispatch({ addedNodes, removedNodes, updatedNodes }) {
            const { creator } = this.options;
            /* eslint-disable no-eval */
            const infos = creator({ addedNodes, removedNodes, updatedNodes });
            for (let i = 0, l = infos.length; i < l; i += 1) {
                const item = infos[i];
                notify(item);
            }
        }
    }
    return Runner;
});
