const { pipeline } = require('stream/promises');
const { createReadStream, createWriteStream } = require('fs');
const { readdir, mkdir, unlink } = require('fs/promises');
const { join } = require('path');

const source = join(__dirname, 'files');
const dist = join(__dirname, 'files-copy');

const copyDir = async (source, dist) => {
  try {
    await mkdir(dist, { recursive: true });
    const readSource = await readdir(source);

    readSource.forEach(async (file) => {
      const pathToSourceFile = join(source, file);
      const pathToDistFile = join(dist, file);

      const rs = createReadStream(pathToSourceFile);
      const ws = createWriteStream(pathToDistFile);

      await pipeline(rs, ws);
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

copyDir(source, dist);
