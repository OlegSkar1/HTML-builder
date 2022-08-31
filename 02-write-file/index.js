const fs = require('fs');
const path = require('path');
const { stdin: input, stdout: output } = process;
const readline = require('readline');

const pathToFile = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(pathToFile);

writeStream;
output.write('Введите текст\n');

const rl = readline.createInterface({ input, output });

rl.on('line', (input) => {
  if (input.trim() === 'exit') {
    console.log('Завершение работы');
    rl.close();
  } else writeStream.write(`${input}\n`);
});

rl.on('SIGINT', () => {
  rl.question('Are you sure you want to exit? ', (answer) => {
    if (answer.match(/^y(es)?$/i)) rl.close();
  });
});
