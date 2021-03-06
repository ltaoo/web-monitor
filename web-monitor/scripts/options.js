define([
    'vue',
    'ELEMENT',
    'jquery',
    './libs/uuid.min',
    './common/template',
    './common/utils',
    './common/notify',
    // './common/configs',
    './components/ShortContent',
], (
    Vue,
    ELEMENT,
    $,
    uuid,
    templates,
    utils,
    notify,
    // defaultConfigs,
) => {
    const loader = new SVGLoader(
        document.getElementById('loader'),
        {
            speedIn: 500,
            easingIn: mina.easeinout,
        },
    );
    loader.show();
    Vue.use(ELEMENT);

    const { render, preDiff, diff } = utils;
    const { parserTemplate, creatorTemplate } = templates;
    // const { weiboConfig } = defaultConfigs;

    const initialForm = {
        title: undefined,
        page: undefined,
        desc: undefined,
        url: undefined,
        type: 'text',
        method: 'GET',
        parserCode: undefined,
        notifyCode: undefined,
        webhook: undefined,
        sleep: 5000,
        limit: undefined,
    };

    /* eslint-disable no-unused-vars */
    const vm = new Vue({
        el: '#root',
        data() {
            return {
                globalLoading: true,
                form: initialForm,
                rules: {
                    title: [
                        {
                            required: true,
                            message: '请输入标题',
                            trigger: 'blur',
                        },
                        {
                            min: 1,
                            max: 20,
                            message: '长度在 1 到 20 个字符之间',
                            trigger: 'blur',
                        },
                    ],
                    page: [
                        {
                            required: true,
                            message: '请输入生效页面地址',
                            trigger: 'blur',
                        },
                    ],
                    url: [
                        {
                            required: true,
                            message: '请输入请求地址',
                            trigger: 'blur',
                        },
                    ],
                    type: [
                        {
                            required: true,
                            message: '请输入响应数据类型',
                            trigger: 'blur',
                        },
                    ],
                    parserCode: [
                        {
                            required: true,
                            message: '请输入内容解析规则',
                            trigger: 'blur',
                        },
                    ],
                    notifyCode: [
                        {
                            required: true,
                            message: '请输入通知生成规则',
                            trigger: 'blur',
                        },
                    ],
                    sleep: [
                        {
                            required: true,
                            message: '请输入请求间隔时间',
                            trigger: 'blur',
                        },
                    ],
                },
                configs: [],
                loading: false,
                results: [],
                response: {},
                isMocking: false,
                mockData: [],
                visible: false,
                updates: '',
                infos: '',
                originConfigs: [],
                fetchOriginConfigsLoading: false,
                outputVisible: false,
                outputContent: '',
            };
        },
        mounted() {
            this.globalLoading = false;
            chrome.storage.sync.get('webs', ({ webs = [] }) => {
                console.log(webs);
                this.configs = webs;
            });
            setTimeout(() => {
                loader.hide();
                $('#loader').remove();
                document.getElementById('root').style = 'visibility: visible;';
            }, 1000);
        },
        methods: {
            handleEdit(index, row) {
                this.reset();
                this.form = { ...row };
            },
            handleDelete(index, row) {
                const webs = this.$data.configs;
                const nextWebs = webs.filter(web => web.page !== row.page);
                chrome.storage.sync.set({ webs: nextWebs }, () => {
                    this.configs = nextWebs;
                    this.$message({
                        type: 'success',
                        message: '删除成功',
                    });
                });
            },
            fetch() {
                this.loading = true;
                const { url, parserCode, type, method, body } = this.$data.form;
                const params = {};
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
                return new Promise((resolve, reject) => {
                    fetch(url, params)
                        .then(res => res[type](), err => Promise.reject(err))
                        .then((content) => {
                            /* eslint-disable no-eval */
                            let parser = () => {};
                            try {
                                parser = eval(render(parserTemplate, { code: parserCode }));
                            } catch (err) {
                                reject('规则失败', err);
                                return;
                            }
                            const res = parser(content, utils);
                            if (res === undefined || !Array.isArray(res)) {
                                reject('解析规则无效');
                                return;
                            }
                            console.log('fetch data success', res);
                            resolve(res);
                        }, (err) => {
                            console.log('fetch data failed', err);
                            reject(err);
                        })
                        .finally(() => {
                            this.loading = false;
                        });
                });
            },
            testFetchContent() {
                this.isMocking = false;
                Promise.all([this.$refs.form.validateField('url'), this.$refs.form.validateField('parserCode')])
                    .then(() => this.fetch())
                    .then((res) => {
                        console.log('fetch test content success');
                        this.results = res;
                    })
                    .catch((err) => {
                        this.$message({
                            type: 'error',
                            message: err,
                        });
                        console.log(err);
                    });
            },
            emptyResults() {
                this.results = [];
            },
            mockChildren() {
                Promise.all([this.$refs.form.validateField('url'), this.$refs.form.validateField('notifyCode')])
                // this.validateForm(['url', 'notifyCode'])
                    .then(() => this.fetch())
                    .then((res) => {
                        this.isMocking = true;
                        try {
                            this.response = res;
                            this.results = [...res];
                            this.mockData = [...res];
                        } catch (err) {
                            console.log(err);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },
            removeMockRow(index, row) {
                const { mockData } = this.$data;
                this.mockData = mockData.filter(item => item.key !== row.key);
            },
            addChild() {
                this.mockData.unshift({});
            },
            compare() {
                const { notifyCode } = this.$data.form;
                const res = this.response;
                let creator = () => '';
                try {
                    creator = eval(render(creatorTemplate, { code: notifyCode }));
                } catch (err) {
                    console.log(err);
                }
                // const prevChildren = translate(this.results);
                // const nextChildren = translate(this.mockData);
                const prevChildren = preDiff(this.results);
                const nextChildren = preDiff(this.mockData);
                const { hasUpdate, ...updates } = diff(prevChildren, nextChildren);
                const infos = creator(updates);
                return {
                    updates,
                    infos,
                };
            },
            showCompareResult() {
                const { updates, infos } = this.compare();
                this.updates = JSON.stringify(updates, null, '\t');
                this.infos = JSON.stringify(infos, null, '\t');
                this.visible = true;
            },
            notify() {
                const { infos } = this.$data;
                console.log(infos);
                JSON.parse(infos).forEach((info) => {
                    console.log(info);
                    notify(info);
                });
            },
            saveConfig() {
                this.validateForm()
                    .then(() => {
                        const { form, configs } = this.$data;
                        const config = { ...form };
                        console.log('当前表单', config);
                        let nextWebs = [];
                        // 如果是新增
                        if (!config.uuid) {
                            console.log('create config');
                            config.uuid = uuid();
                            nextWebs = configs.concat(config);
                        } else {
                            nextWebs = configs.map((conf) => {
                                if (conf.uuid !== config.uuid) {
                                    return conf;
                                }
                                return {
                                    ...form,
                                };
                            });
                        }
                        chrome.storage.sync.set({ webs: nextWebs }, () => {
                            console.log('create success', nextWebs);
                            this.configs = nextWebs;
                            this.reset();
                            this.$message({
                                type: 'success',
                                message: '保存成功',
                            });
                            this.restart();
                        });
                    });
            },
            restart() {
                chrome.runtime.sendMessage({ command: 'restart' });
            },
            output() {
                this.outputVisible = true;
                this.outputContent = JSON.stringify(this.$data.form);
            },
            reset() {
                this.form = initialForm;
                this.$refs.form.resetFields();
                this.results = [];
                this.response = {};
                this.isMocking = false;
                this.mockData = [];
                this.updates = '';
                this.infos = '';
            },
            testHook() {
                const { infos, form: { webhook } } = this.$data;
                JSON.parse(infos).forEach((info) => {
                    const url = render(webhook, info);
                    fetch(url)
                        .catch((err) => {
                            this.$message({
                                type: 'error',
                                message: JSON.stringify(err),
                            });
                        });
                });
            },
            validateForm(params) {
                return new Promise((resolve, reject) => {
                    const callback = (valid, error) => {
                        console.log(valid, error);
                        if (valid) {
                            resolve(valid);
                            return;
                        }
                        reject();
                    };
                    const validate = 'validate';
                    const args = [
                        callback,
                    ];
                    this.$refs.form[validate](...args);
                });
            },
            fetchOriginConfigs() {
                this.fetchOriginConfigsLoading = true;
                fetch('https://raw.githubusercontent.com/ltaoo/web-monitor/master/configs/list.json')
                    .then(res => res.text())
                    .then((json) => {
                        const { configs } = JSON.parse(json);
                        this.originConfigs = configs;
                        this.fetchOriginConfigsLoading = false;
                    })
                    .catch((err) => {
                        console.log(err);
                        this.fetchOriginConfigsLoading = false;
                    });
            },
            addOriginConfig(config) {
                this.fetchOriginConfigsLoading = true;
                fetch(`https://raw.githubusercontent.com/ltaoo/web-monitor/master/configs/${config.filename}`)
                    .then(res => res.text())
                    .then((json) => {
                        const data = JSON.parse(json);
                        this.$data.form = data;
                        this.fetchOriginConfigsLoading = false;
                    })
                    .catch((err) => {
                        this.fetchOriginConfigsLoading = false;
                        console.log(err);
                    });
            },
        },
    });
});
