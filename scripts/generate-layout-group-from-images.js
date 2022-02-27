const fs = require('fs');
const { capitalize } = require('lodash');
const path = require('path');
const uuid = require('uuid');

const [,,groupName] = process.argv;

if(!groupName){
    console.error('Please provide a layout group name',)
    process.exit();
}

const layoutsDirPath = path.resolve(`src/layouts/${groupName}`);
const imagesDirPath = path.join(layoutsDirPath, `images`);
const images = fs.readdirSync(imagesDirPath);

if(!fs.existsSync(imagesDirPath)){
    console.error('Cannot find directory', imagesDirPath)
    process.exit();
}

const layoutGroup = images.map(file=>(
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
    name: "${capitalize(groupName)}",
    layouts: [
        ${layoutGroup.join(',\n')}
    ]
};

export default ${groupName};
`

fs.writeFileSync(
    path.join(layoutsDirPath, 'index.js'),
    layoutGroupContent
);

console.log('done');