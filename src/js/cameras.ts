import { PerspectiveCamera, Vector3 } from 'three';

const fov = 50;
const ratio = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 10000;

function zoom(camera: PerspectiveCamera, value: number = 1) {
  camera.position.set(1 * value, 0.75 * value, 1 * value);
  camera.position.z = 2;
  camera.lookAt(new Vector3());
}

export const dev = new PerspectiveCamera(fov, ratio, near, far);
export const main = new PerspectiveCamera(fov, ratio, near, far);
export default {
  dev,
  main
}

zoom(dev, 8);
zoom(main, 3);
