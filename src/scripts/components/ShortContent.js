define(['vue'], (Vue) => {
    Vue.component('short-content', {
        render(createElement) {
            const { limit = 20, content } = this;
            const shortContent = `${content.slice(0, limit)}...`;
            return createElement('el-popover', {
                props: {
                    placement: 'top',
                    trigger: 'hover',
                },
            }, [
                createElement('p', {
                    domProps: {
                        innerHTML: content,
                        style: 'width: 300px;',
                    },
                    attrs: {
                        style: 'width: 300px;',
                    },
                }),
                createElement('div', {
                    slot: 'reference',
                }, [
                    createElement('p', {
                    }, shortContent),
                ]),
            ]);
        },
        props: ['content'],
    });
});
