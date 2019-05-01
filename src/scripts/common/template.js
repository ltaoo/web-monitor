define(() => {
    const parserTemplate = `;(function () {
        function parser(html, { removeWhiteSpace }) {
            {{{code}}}
        }
        return parser;
    }())`;
    const creatorTemplate = `;(function() {
        function creator(updates) {
            {{{code}}}
        }
        return creator;
    }());`;

    const templates = {
        parserTemplate,
        creatorTemplate,
    };

    return templates;
});
