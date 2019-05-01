define([
    'vue',
    'ELEMENT',
    'scripts/libs/uuid.min.js',
], (Vue, ELEMENT, UUID) => {
    Vue.use(ELEMENT);

    function uuid() {
        return UUID.create().toString();
    }

    const initialForm = {
        title: undefined,
        page: undefined,
        url: undefined,
        type: 'text',
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
                            max: 10,
                            message: '长度在 1 到 10 个字符之间',
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
                        {
                            min: 5000,
                            message: '不能低于 5000',
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
            };
        },
        mounted() {
            this.globalLoading = false;
            this.init();
            chrome.storage.sync.get('webs', ({ webs = [] }) => {
                this.configs = webs;
            });
        },
        methods: {
            handleEdit(index, row) {
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
                const { url, parserCode, type } = this.$data.form;
                return new Promise((resolve, reject) => {
                    this.loading = true;
                    // if (!url) {
                    //     return;
                    // }
                    const errorCb = (err) => {
                        console.log('fetch data failed', err);
                        reject(err);
                    };
                    fetch(url)
                        .then(res => res[type](), err => Promise.reject(err))
                        .then((content) => {
                            /* eslint-disable no-eval */
                            const parser = eval(render(parserTemplate, { code: parserCode }));
                            const res = parser(content, utils);
                            console.log('fetch data success', res);
                            this.loading = false;
                            resolve(res);
                        }, errorCb)
                        .finally(() => {
                            this.loading = false;
                        });
                });
            },
            testFetchContent() {
                this.validateForm(['url', 'parserCode'])
                    .then(() => this.fetch())
                    .then((res) => {
                        this.results = res;
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },
            emptyResults() {
                this.results = [];
            },
            mockChildren() {
                this.validateForm(['url', 'notifyCode'])
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
                JSON.parse(infos).forEach((info) => {
                    notify(info);
                });
            },
            saveConfig() {
                this.validateForm()
                    .then(() => {
                        const { form, configs } = this.$data;
                        const config = { ...form };

                        let nextWebs = [];
                        // 如果是新增
                        if (!config.uuid) {
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
                            this.configs = nextWebs;
                            this.init();
                            this.$message({
                                type: 'success',
                                message: '保存成功',
                            });
                        });
                    });
            },
            init() {
                this.form = initialForm;
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
                    const callback = (valid) => {
                        if (valid) {
                            resolve(valid);
                        }
                    };
                    let validate = 'validate';
                    const args = [
                        callback,
                    ];
                    if (params) {
                        validate = 'validateField';
                        args.unshift(params);
                    }
                    // console.log(validate, args);
                    this.$refs.form[validate](...args);
                });
            },
        },
    });
});
