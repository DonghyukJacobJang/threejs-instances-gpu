import { AmbientLight, DirectionalLight, PerspectiveCamera, SpotLight } from 'three';
import { guiLights } from './utils/gui';

const STEP_PRECISION = 0.1;

const guiAmbient = guiLights.addFolder('ambient');
const guiSpot = guiLights.addFolder('spot');
const guiDirectional = guiLights.addFolder('directional');

// guiAmbient.open();
// guiSpot.open();
// guiDirectional.open();

// Lights
const controller = {
  ambient: 0xd4d4d4,
  directional: 0xffffff,
  spot: 0xffffff
};

const lights = {
  ambient: new AmbientLight(controller.ambient),
  directional: new DirectionalLight(controller.directional, 1),
  spot: new SpotLight(controller.spot, 1)
};

lights.spot.position.set(50, 50, 50);

lights.spot.castShadow = true;
lights.spot.shadow.mapSize.width = 2048;
lights.spot.shadow.mapSize.height = 2048;

if (lights.spot.shadow.camera instanceof PerspectiveCamera) {
  lights.spot.shadow.camera.near = 1;
  lights.spot.shadow.camera.far = 500;
  lights.spot.shadow.camera.fov = 60;
}

const updateLights = () => {
  lights.ambient.color.setHex(Number(`${controller.ambient}`.replace('#', '0x')));
  lights.directional.color.setHex(
    Number(`${controller.directional}`.replace('#', '0x'))
  );
  lights.spot.color.setHex(Number(`${controller.spot}`.replace('#', '0x')));
};

guiAmbient.addColor(controller, 'ambient').name('color').onChange(updateLights);
guiDirectional.addColor(controller, 'directional').name('color').onChange(updateLights);
guiSpot.addColor(controller, 'spot').name('color').onChange(updateLights);

guiDirectional.add(lights.directional.position, 'x', -1, 1).step(STEP_PRECISION).name('direction x');
guiDirectional.add(lights.directional.position, 'y', -1, 1).step(STEP_PRECISION).name('direction y');
guiDirectional.add(lights.directional.position, 'z', -1, 1).step(STEP_PRECISION).name('direction z');

guiSpot.add(lights.spot.position, 'x', -50, 50).step(STEP_PRECISION).name('position x');
guiSpot.add(lights.spot.position, 'y', -50, 50).step(STEP_PRECISION).name('position y');
guiSpot.add(lights.spot.position, 'z', -50, 50).step(STEP_PRECISION).name('position z');

guiAmbient.add(lights.ambient, 'intensity', 0, 2);
guiDirectional.add(lights.directional, 'intensity', 0, 2);
guiSpot.add(lights.spot, 'intensity', 0, 2);

export default lights;
