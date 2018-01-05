import { WEBGL_DIR } from './constants';
import Asset from './utils/loading/asset';
import { IMAGE, JSON, WEBGL_TEXTURE } from './utils/loading/constants';

export default [
  new Asset({
    id: 'image',
    src: `${WEBGL_DIR}test/test-1024.jpg`,
    type: IMAGE
  }),
  new Asset({
    id: 'json',
    src: `${WEBGL_DIR}test/data.json`,
    type: JSON
  }),
  new Asset({
    id: 'texture',
    src: `${WEBGL_DIR}test/test-1024.jpg`,
    type: WEBGL_TEXTURE
  })
];
