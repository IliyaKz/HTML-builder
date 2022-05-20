const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, {withFileTypes: true}, (error, files) => {
  if (error) return console.error(error);
  files.forEach( (file) => {
    if (file.isFile()) {
      const filePath = path.join(__dirname, 'secret-folder', file.name);
      const name = path.basename(filePath, path.extname(filePath));
      const ext = path.extname(filePath).slice(1);
      fs.stat(filePath, (error, stats) => {
        if (error) return console.error(error);
        console.log(`${name} - ${ext} - ${stats.size / 1024}kb`);
      });
    }
  });
});