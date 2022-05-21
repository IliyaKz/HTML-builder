const fs = require('fs/promises');
const path = require('path');
const dirPath = path.join(__dirname, 'files');
const dirPathCopy = path.join(__dirname, 'files-copy');

async function copyDir(source, copy) {
  try {
    await fs.rm(copy, { recursive: true, force: true });
    await fs.mkdir(copy, {recursive: true});
    const files = await fs.readdir(source, {withFileTypes: true});
    files.forEach((file) => {
      if (file.isFile()) {
        fs.copyFile(path.join(source, file.name), path.join(copy, file.name));
        console.log('Файл скопирован');
      } else if (file.isDirectory()) {
        copyDir(path.join(source, file.name), path.join(copy, file.name));
        console.log('Папка скопирована');
      }
    });
  } catch (error) {
    console.error(error);
  }
}
copyDir(dirPath, dirPathCopy);
