import { AxisHelper, Clock, GridHelper, PerspectiveCamera } from 'three';
import assets from './assets';
import cameras from './cameras';
import { DEV_HELPERS, DEV_STATS } from './constants';
import * as flags from './flags';
import OrbitControls from './lib/three/examples/OrbitControls';
import RenderStats from './lib/three/render-stats';
import lights from './lights';
import { setQuery } from './params';
import renderer from './renderer';
import scene from './scene';
import { guiFlags } from './utils/gui';
import AssetLoader from './utils/loading/asset-loader';
import stats from './utils/stats';

// Objects
import Sphere from './objects/sphere/sphere';

class WebGLPrototype {
  private clock: Clock;
  private renderStats: RenderStats;
  private controls: any;
  private sphere: Sphere;

  constructor() {
    // Renderer
    document.body.appendChild(renderer.domElement);

    // Helpers
    if (DEV_HELPERS) {
      scene.add(new GridHelper(10, 10));
      // Need to wait for @types/three to update AxisHelper -> AxesHelper
      scene.add(new AxisHelper());
    }

    // Lights
    Object.keys(lights).forEach((light: string) => {
      scene.add(lights[light]);
    });

    // Stats
    if (DEV_STATS) {
      this.renderStats = new RenderStats();
      this.renderStats.domElement.style.position = 'absolute';
      this.renderStats.domElement.style.left = '0px';
      this.renderStats.domElement.style.top = '48px';
      document.body.appendChild(this.renderStats.domElement);
      document.body.appendChild(stats.domElement);
    }

    // Controls
    this.controls = {
      dev: new OrbitControls(cameras.dev, renderer.domElement),
      main: new OrbitControls(cameras.main, renderer.domElement)
    };

    // Clock
    this.clock = new Clock(true);

    // Flags
    guiFlags
      .add(flags, 'debugCamera')
      .onChange((val: string | boolean | number) => {
        setQuery('cameraDebug', val);
      });

    // Objects
    this.sphere = new Sphere();
    scene.add(this.sphere.mesh);

    // Listeners
    window.addEventListener('resize', this.onResize, false);

    AssetLoader('default', assets)
      .then(this.onAssetsLoaded)
      .catch(this.onAssetsError);

    this.update();
  }

  private onAssetsLoaded = (value: any) => {
    console.log('assets loaded', value);
  };

  private onAssetsError = (error: any) => {
    console.warn(error);
  };

  private onResize = () => {
    cameras.dev.aspect = window.innerWidth / window.innerHeight;
    cameras.main.aspect = window.innerWidth / window.innerHeight;

    cameras.dev.updateProjectionMatrix();
    cameras.main.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  private render(
    camera: PerspectiveCamera,
    left: number,
    bottom: number,
    width: number,
    height: number
  ) {
    left *= window.innerWidth;
    bottom *= window.innerHeight;
    width *= window.innerWidth;
    height *= window.innerHeight;

    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);
    renderer.setClearColor(0x121212);
    renderer.render(scene, camera);
  }

  private update = () => {
    requestAnimationFrame(this.update);

    if (DEV_STATS) {
      stats.begin();
    }

    this.controls.dev.update();
    this.controls.main.update();

    // Objects
    const delta = this.clock.getDelta();

    this.sphere.update(delta);

    if (flags.debugCamera) {
      this.render(cameras.dev, 0, 0, 1, 1);
      this.render(cameras.main, 0, 0.75, 0.25, 0.25);
    } else {
      this.render(cameras.main, 0, 0, 1, 1);
    }

    if (DEV_STATS) {
      this.renderStats.update(renderer);
      stats.end();
    }
  };
}

export default new WebGLPrototype();
