const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');
const pathDist = path.join(__dirname, 'project-dist');
const pathStyles = path.join(__dirname, 'styles');
const pathComponents = path.join(__dirname, 'components');
const pathTemplate = path.join(__dirname, 'template.html');
const stylesArr = [];

async function replaceTag(data) {
  if(data.indexOf('{{') !== -1) {
    const tagStart = data.indexOf('{{');
    const tagEnd = data.indexOf('}}');
    const filePath = path.join(pathComponents, `${data.slice(tagStart + 2, tagEnd)}.html`);
    fs.access(filePath, fs.constants.F_OK, (error) => {
      if (error) {
        console.log(`Компонент ${data.slice(tagStart + 2, tagEnd)}.html не существует, сборка прервана. Проверьте корректность данных в temlate.html`);
        process.exit();
      }
    });
    const dataComponent = await fsPromises.readFile(filePath, 'utf-8');
    data = data.replace(data.slice(tagStart - 4, tagEnd + 2), dataComponent);
    replaceTag(data);
  } else {
    await fsPromises.writeFile(path.resolve(pathDist, 'index.html'), data, 'utf-8');
  }
}

async function createHTML() {
  const data = await fsPromises.readFile(pathTemplate, 'utf-8');
  replaceTag(data);
}

async function bundleCSS(source, dist) {
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
    await fsPromises.appendFile(dist, stylesArr.reverse().join('\n'));
  } catch (error) {
    console.error(error);
  }
}

async function copyDir(source, copy) {
  try {
    await fsPromises.mkdir(copy, {recursive: true});
    const files = await fsPromises.readdir(source, {withFileTypes: true});
    files.forEach((file) => {
      if (file.isFile()) {
        fsPromises.copyFile(path.join(source, file.name), path.join(copy, file.name));
      } else if (file.isDirectory()) {
        copyDir(path.join(source, file.name), path.join(copy, file.name));
      }
    });
  } catch (error) {
    console.error(error);
  }
}

async function buildPage() {
  try {
    await fsPromises.rm(pathDist, { recursive: true, force: true });
    await fsPromises.mkdir(pathDist, {recursive: true});
    await createHTML();
    await bundleCSS(pathStyles, path.join(pathDist, 'style.css'));
    await copyDir(path.join(__dirname, 'assets'), path.join(pathDist, 'assets'));
  } catch (error) {
    console.error(error);
  }
}
buildPage();

