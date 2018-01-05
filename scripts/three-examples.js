const fs = require('fs');
const shell = require('shelljs');

const EXAMPLES_DIR = './node_modules/three/examples/js';
const DEST_DIR = './src/js/lib/three/examples';

shell.mkdir('-p', DEST_DIR);

const files = [`${EXAMPLES_DIR}/controls/OrbitControls.js`];

const regexp = /THREE\./g;

function template(dependencies, src, cls) {
  let dependenciesFormatted = '';
  dependencies.forEach(dependency => {
    dependenciesFormatted += `${dependency}, \n`;
  });

  const imports =
    dependencies.length > 0
      ? `
 import {
 ${dependenciesFormatted}
 } from 'three';
 `
      : '';

  return `
  ${imports}
  var ${cls};
  ${src}
  export default ${cls};
 `;
}

files.forEach(file => {
  const filename = file.split('/').pop();

  const contents = shell.cat(file);

  // Find all occurances of THREE.
  const occurances = contents.match(/THREE.\b(\w|')+\b/gim) || [];
  let imports = [];

  // Filename needs to match the variable name
  const className = filename.split('.')[0];
  occurances.forEach(occurance => {
    // Make sure THREE is in the occurance
    if (occurance.indexOf('THREE') !== -1) {
      const dependency = occurance.replace(regexp, '');

      if (dependency !== className) {
        imports.push(dependency);
      }
    }
  });

  imports = imports.filter((item, pos) => imports.indexOf(item) === pos);

  // Remove all THREE.
  const source = contents.replace(regexp, '');
  const tmpl = template(imports, source, className);

  // Write file
  fs.writeFile(`${DEST_DIR}/${filename}`, tmpl, error => {
    if (error) {
      return console.log(error); // eslint-disable-line no-console
    }
    return console.log(`${file} > ${filename}`); // eslint-disable-line no-console
  });
});
