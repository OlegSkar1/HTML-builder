const { join, extname } = require('path');
const { createReadStream, createWriteStream } = require('fs');
const { readdir, stat, unlink } = require('fs/promises');
const { pipeline } = require('stream/promises');

const mergeFiles = async (source, dist) => {
  try {
    await stat(dist);
    await unlink(dist);
    mergeFiles(source, dist);
  } catch (error) {
    const readSource = await readdir(source);

    readSource.forEach(async (file) => {
      const filePath = join(source, file);
      const extName = extname(filePath) === '.css';
      const fileStats = await stat(filePath);

      if (fileStats.isDirectory()) {
        const sourceFolder = filePath;
        mergeFiles(sourceFolder, dist);
      } else if (fileStats.isFile() && extName) {
        const rs = createReadStream(filePath);
        const ws = createWriteStream(dist, { flags: 'a' });
        await pipeline(rs, ws);
      }
    });
  }
};

module.exports = mergeFiles;
