const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const read = readline.createInterface({ input, output });
const filePath = path.join(__dirname, 'text.txt');
  
function create() {
  fs.writeFile(filePath, '', (error) => {
    if (error) return console.error(error.message);
  });
}
fs.access(filePath, fs.constants.F_OK, (error) => {
  if (error) create();
  read.setPrompt('Добро пожаловать! Начните ввод данных\n');
  read.prompt();
  read.on('line', (text) => {
    if (text === 'exit') {
      read.close();
      return;
    }
    fs.appendFile(filePath, text, (error) => {  
      if (error) return console.error(error.message);
    });
  });
  read.once('close', () => console.log('Ввод данных завершен'));
});