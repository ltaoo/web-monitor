const fs = require('fs');
const path = require('path');

const IGNORE = ['create.js', 'list.json'];

try {
    const files = fs.readdirSync(path.join(__dirname));
    const output = {
        configs: [],
    };
    for (let i = 0, l = files.length; i < l; i += 1) {
        const file = files[i];
        if (!IGNORE.includes(file)) {
            const content = fs.readFileSync(path.join(__dirname, file));
            const { title, desc, page } = JSON.parse(content);
            output.configs.push({
                title,
                desc,
                page,
                filename: file,
            });
        }
    }
    fs.writeFileSync(path.join(__dirname, 'list.json'), JSON.stringify(output));
    console.log('create list.json success');
} catch (err) {
    console.log('create list.json failed');
    process.exit(0);
}
