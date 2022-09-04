const { join, extname } = require('path');
const { createReadStream, createWriteStream } = require('fs');
const { readdir, stat, unlink } = require('fs/promises');
const { pipeline } = require('stream/promises');

const mergeFiles = async (source, dist, distFileName) => {
  source = join(__dirname, source);
  dist = join(__dirname, dist);
  const pathToBundle = join(dist, distFileName);
  try {
    await stat(pathToBundle);
    await unlink(pathToBundle);
    mergeFiles('styles', 'project-dist', 'bundle.css');
  } catch (error) {
    const readSource = await readdir(source);

    readSource.forEach(async (file) => {
      const filePath = join(source, file);
      const extName = extname(filePath) === '.css';
      const fileStats = await stat(filePath);

      if (fileStats.isFile() && extName) {
        const rs = createReadStream(filePath);
        const ws = createWriteStream(pathToBundle, { flags: 'a' });
        await pipeline(rs, ws);
      }
    });
  }
};

mergeFiles('styles', 'project-dist', 'bundle.css');

module.exports = mergeFiles;
