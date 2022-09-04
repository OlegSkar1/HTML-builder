const copyDir = require('../04-copy-directory');
const mergeFiles = require('../05-merge-styles');
const { join } = require('path');
const { mkdir } = require('fs/promises');

const dist = join(__dirname, 'project-dist');
const sourceAssets = join(__dirname, 'assets');
const distAssets = join(dist, 'assets');
const sourceStyles = join(__dirname, 'styles');
const distStyles = join(dist, 'style.css');

const createApp = async () => {
  try {
    await copyDir(sourceAssets, distAssets);
    await mergeFiles(sourceStyles, distStyles);
  } catch (err) {
    await mkdir(dist);
  }
};

createApp();
