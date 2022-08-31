'use strict';
const { readdir, stat } = require('fs/promises');
const path = require('path');

const pathToFolder = path.join(__dirname, './secret-folder');

const kb = 1024;

const getSizeKb = (fileStats, round) => (fileStats.size / kb).toFixed(round);

const getExtention = (pathToFile) => {
  const extension = path.extname(pathToFile);
  return extension.slice(1);
};

const getBaseName = (pathToFile, ext) => path.basename(pathToFile, ext);

const readDirectory = async () => {
  try {
    const folderContent = await readdir(pathToFolder);

    folderContent.forEach(async (item) => {
      const pathToFile = path.join(pathToFolder, item);

      const itemStats = await stat(pathToFile);

      if (itemStats.isFile()) {
        const ext = path.extname(pathToFile);

        const basename = getBaseName(pathToFile, ext);
        const extension = getExtention(pathToFile);
        const filesize = getSizeKb(itemStats, 3);

        const output = `${basename} - ${extension} - ${filesize}Kb`;
        console.log(output);
      }
    });
  } catch (err) {
    if (err) console.error(err.message);
  }
};

readDirectory();
