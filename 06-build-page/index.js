const copyDir = require('../04-copy-directory');
const mergeFiles = require('../05-merge-styles');
const { join } = require('path');
const { readFile } = require('fs/promises');

const source = join(__dirname, 'assets');
const dist = join(__dirname, 'project-dist/assets');

const createApp = async () => {
  copyDir(source, dist);
  // try {
  // } catch (err) {
  //   console.log(err.message);
  // }
};

createApp();
