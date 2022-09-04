const { pipeline } = require('stream/promises');
const { createReadStream, createWriteStream } = require('fs');
const { readdir, mkdir, unlink } = require('fs/promises');
const { join } = require('path');

const copyDir = async (source, dist) => {
  try {
    await mkdir(dist, { recursive: true });
    const readSource = await readdir(source, { withFileTypes: true });

    readSource.forEach(async (file) => {
      if (file.isDirectory()) {
        const sourceFolder = join(source, file.name);
        const distFolder = join(dist, file.name);
        copyDir(sourceFolder, distFolder);
      } else {
        const pathToSourceFile = join(source, file.name);
        const pathToDistFile = join(dist, file.name);

        const rs = createReadStream(pathToSourceFile);
        const ws = createWriteStream(pathToDistFile);

        await pipeline(rs, ws);
      }
    });
  } catch (err) {
    console.log(err.message);
  }

  trackFiles(source, dist);
};

const trackFiles = async (source, dist) => {
  try {
    const readDist = await readdir(dist);
    const readSource = await readdir(source);

    readDist.forEach(async (file) => {
      const pathToDistFile = join(dist, file);
      if (!readSource.includes(file)) {
        await unlink(pathToDistFile);
      }
    });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = copyDir;
