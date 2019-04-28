document.addEventListener('DOMContentLoaded', ready);

const TEXT_TAGS = [
	'p',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'li',
	'span',
	'a',
];
const IGNORE_TAGS = [
	'hr',
	'script',
];
/**
 * 把整个页面给转换为对象
 * {
 * 	tag: 'body,
 * 	body: {
 * 		children: [
 * 			{
 * 				tag: 'div',
 * 				children: [
 * 				],
 * 			},
 * 			{
 * 				tag: 'div',
 * 				text: 'hello',
 * 			},
 * 		],
 * 	}
 * }
 */
function parse(element) {
	const { localName, children, nodeType, textContent } = element;
	const root = {
		tag: localName,
	};
	if (TEXT_TAGS.includes(localName) && textContent) {
		root.text = textContent;
		return root;
	}
	root.children = {};
	for (let i = 0, l = children.length; i < l; i += 1) {
		const child = children[i];
		if (!IGNORE_TAGS.includes(child.localName)) {
			// root.children.push(parse(child));
			root.children[`${child.localName}-${i}`] = parse(child);
		}
	}
	return root;
}

function ready() {
	const { href } = location;
	if (!href.includes('github')) {
		return;
	}
	let prevObj = parse(document.getElementById('dashboard'));
	console.log(prevObj);
	setInterval(() => {
		let obj = parse(document.getElementById('dashboard'));
		const result = diff(prevObj, obj);
		console.log(result);
		prevObj = obj;
	}, 10000);
}