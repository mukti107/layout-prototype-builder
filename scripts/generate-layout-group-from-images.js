const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const groupName = 'headers';

const layoutsDirPath = path.resolve(`src/layouts/${groupName}`);

const files = fs.readdirSync(path.join(layoutsDirPath, `images`));

const layoutGroup = files.map(file=>(
`{
    name: "${file}",
    id: "${uuid.v4()}",
    variations: {
        dark: require('./images/${file}'),
        light: require('./images/${file}'),
    },
}`));

const layoutGroupContent = `const ${groupName} = {
    id: "${groupName}",
    name: "${groupName}",
    layouts: [
        ${layoutGroup.join(',\n')}
    ]
};

export default ${groupName};
`

console.log(layoutGroupContent);

fs.writeFileSync(
    path.join(layoutsDirPath, 'index.js'),
    layoutGroupContent
);