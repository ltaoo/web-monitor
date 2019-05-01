/**
 * https://developers.chrome.com/extensions/richNotifications
 * https://developer.chrome.com/apps/notifications
 * https://developers.google.com/web/updates/2017/04/native-mac-os-notifications#chrome_extension_changes
 */

function uuid() {
    return UUID.create().toString();
}

const { render, preDiff, diff } = utils;

const {
    parserTemplate,
    creatorTemplate,
} = templates;

/* eslint-disable no-unused-vars */
const vm = new Vue({
    el: '#root',
    data() {
        return {
            globalLoading: true,
            configs: [],
            loading: false,
            form: {},
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
                fetch(url)
                    .then(res => res[type]())
                    .then((content) => {
                        /* eslint-disable no-eval */
                        const parser = eval(render(parserTemplate, { code: parserCode }));
                        const res = parser(content, utils);
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            });
        },
        testFetchContent() {
            this.fetch()
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
            this.isMocking = true;
            this.fetch()
                .then((res) => {
                    try {
                        this.response = res;
                        this.results = [...res];
                        this.mockData = [...res];
                    } catch (err) {
                        console.log(err);
                    }
                })
                .catch((err) => {

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
        },
        init() {
            this.form = {};
            this.results = [];
            this.response = {};
            this.isMocking = false;
            this.mockData = [];
            this.updates = '';
            this.infos = '';
        },
    },
});
