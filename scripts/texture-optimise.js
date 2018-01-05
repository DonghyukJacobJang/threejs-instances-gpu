const fs = require('fs');
const shell = require('shelljs');
const sharp = require('sharp');
const filename = require('file-name');
const fileExtension = require('file-extension');

const TEXTURES_DIR = './src/assets/webgl';
const DESTINATION_DIR = './public/assets/webgl';

const resizeTexture = (fileIn, fileOut, size, resize) =>
  new Promise(resolve => {
    if (!resize) {
      sharp(fileIn).toFile(fileOut, () => {
        resolve(fileOut);
      });
      return;
    }
    sharp(fileIn)
      .resize(size, size)
      .toFile(fileOut, () => {
        resolve(fileOut);
      });
  });

const processTexture = texture =>
  new Promise((resolve, reject) => {
    const queue = [];
    texture.sizes.forEach(size => {
      const outFile = texture.resize
        ? `${texture.tmpDirectory}/${texture.fileName}-${size}.${
            texture.extension
          }`
        : `${texture.tmpDirectory}/${texture.fileName}.${texture.extension}`;
      queue.push(
        resizeTexture(texture.fullPath, outFile, size, texture.resize)
      );
    });

    Promise.all(queue)
      .then(resolve)
      .catch(reject);
  });

shell.ls(TEXTURES_DIR).forEach(directory => {
  const fullDirectory = `${TEXTURES_DIR}/${directory}`;

  if (!fs.lstatSync(fullDirectory).isDirectory()) {
    return;
  }

  console.log(`Processing textures for: '${directory}'`);

  // Define config for directory
  const templateConfig = {
    sizes: [1024], // what sizes to output
    resizeFilter: [] // What textures not to resize, add the file names e.g test.png
  };

  let config;

  try {
    config = JSON.parse(fs.readFileSync(`${fullDirectory}/config.json`));
  } catch (error) {
    config = templateConfig;
  }

  // Create a temporary output directory
  const tmpDirectory = `${fullDirectory}/tmp`;
  shell.mkdir('-p', tmpDirectory);

  // Get textures
  const textures = [];
  shell.ls('-A', `${fullDirectory}`).forEach(file => {
    if (/\.(jpg|png)$/i.test(file)) {
      const fileName = filename(file);
      const extension = fileExtension(file);
      const sizes = config.sizes;
      const resize = config.resizeFilter.indexOf(fileName) === -1;
      textures.push({
        file,
        sizes,
        resize,
        fileName,
        fullPath: `${fullDirectory}/${file}`,
        extension,
        tmpDirectory
      });
    }
  });

  // Resize textures
  const queue = [];
  textures.forEach(texture => {
    queue.push(processTexture(texture));
  });

  Promise.all(queue)
    .then(() => {
      // Create destination path
      const destinationDirectory = `${DESTINATION_DIR}/${directory}`;

      // Remove old texture files
      shell.ls(destinationDirectory).forEach(file => {
        const extension = fileExtension(file);
        if (/(jpg|png)$/i.test(extension)) {
          const fullPath = `${destinationDirectory}/${file}`;
          shell.rm(fullPath);
        }
      });

      // Make directory if it doesn't exist
      shell.mkdir('-p', destinationDirectory);

      // Copy new texture files to assets directory
      shell.cp(`${tmpDirectory}/*`, destinationDirectory);

      // Cleanup tmp directory
      shell.rm('-rf', tmpDirectory);
    })
    .catch(error => {
      console.warn(`Error processing textures for '${directory}': `, error); // eslint-disable-line no-console
    });
});
