const copyDir = require('../04-copy-directory');
const mergeFiles = require('../05-merge-styles');
const { join, basename } = require('path');
const { createReadStream, createWriteStream } = require('fs');
const { mkdir, readdir, readFile } = require('fs/promises');
const { pipeline } = require('stream/promises');

const dist = join(__dirname, 'project-dist');
const sourceAssets = join(__dirname, 'assets');
const distAssets = join(dist, 'assets');
const sourceStyles = join(__dirname, 'styles');
const distStyles = join(dist, 'style.css');

const createApp = async () => {
  try {
    await copyDir(sourceAssets, distAssets);
    await mergeFiles(sourceStyles, distStyles);

    const templatePath = join(__dirname, 'template.html');
    const indexPath = join(dist, 'index.html');

    const rs = createReadStream(templatePath);
    const ws = createWriteStream(indexPath);
    await pipeline(rs, ws);

    let index = await readFile(indexPath, 'utf-8');
    const componentsPath = join(__dirname, 'components');

    const components = await readdir(componentsPath);
    components.forEach(async (component) => {
      const pathToComponent = join(componentsPath, component);
      const basenameComponent = basename(pathToComponent, '.html');

      const componentContent = await readFile(pathToComponent);

      index += index.replace(`{{${basenameComponent}}}`, componentContent);
    });
    await pipeline(index, ws);
  } catch (err) {
    console.log(err.message);
    await mkdir(dist);
  }
};

createApp();
