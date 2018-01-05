# WebGL Prototype

A small boilerplate for prototyping with WebGL.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status](https://david-dm.org/amelierosser/webgl-prototype.svg)](https://david-dm.org/amelierosser/webgl-prototype)
[![devDependency Status](https://david-dm.org/amelierosser/webgl-prototype/dev-status.svg)](https://david-dm.org/amelierosser/webgl-prototype#info=devDependencies)

**Includes**

* [TypeScript](https://www.typescriptlang.org/)
* [threejs](https://github.com/mrdoob/three.js/)
* [Three Material Modifier](https://github.com/jamieowen/three-material-modifier)

**Tasks**

* `yarn run start` Start the local server and watch for changes
* `yarn run build` Build and minify
* `yarn run lint` Lint your ts code
* `yarn run three-examples` Convert three example files to es6 modules

**Flags**

Open the following url to enable all debug helpers.

http://localhost:8080/?gui&helpers&stats

**Editor**

If you use vscode you can add glsl syntax highlighting for `.glsl.ts` files.
Update your preferences with this snippet.

```
"files.associations": {
  "*.glsl.ts": "glsl"
}
```
