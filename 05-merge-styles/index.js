const path = require('path');
const fsPromises = require('fs/promises');
const pathSource = path.join(__dirname, 'styles');
const pathBundle = path.join(__dirname, 'project-dist', 'bundle.css');
const stylesArr = [];

async function createBundle(source, dist) {
  try {
    const files = await fsPromises.readdir(source, {withFileTypes: true});
    const styleFiles = files.filter(file => {
      if (file.isFile() && path.extname(path.join(source, file.name)) === '.css') {
        return true;
      }
    });
    for (let i = 0; i < styleFiles.length; i++) {
      const filePath = path.join(source, styleFiles[i].name);
      const data = await fsPromises.readFile(filePath, 'utf-8');
      stylesArr.push(data);
    }
    await fsPromises.open(dist, 'w');
    await fsPromises.appendFile(dist, stylesArr.join('\n'));
  } catch (error) {
    console.error(error);
  }
}

createBundle(pathSource, pathBundle);