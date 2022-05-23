const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const read = readline.createInterface({ input, output });
const filePath = path.join(__dirname, 'text.txt');
  
function write() {
  fs.writeFile(filePath, '', (error) => {
    if (error) return console.error(error.message);
  });
  console.log('Добро пожаловать! Начните ввод данных');
  read.on('line', (text) => {
    if (text === 'exit') {
      read.close();
      return;
    }
    fs.appendFile(filePath, `${text}\n`, (error) => {  
      if (error) return console.error(error.message);
    });
  });
  read.once('close', () => console.log('Ввод данных завершен'));
}
write();