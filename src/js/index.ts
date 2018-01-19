import {
  AxisHelper, Clock, GridHelper, LoadingManager, Mesh, PerspectiveCamera, RawShaderMaterial, SphereGeometry
} from 'three';
import * as THREE from 'three';
import * as OBJLoader from 'three-obj-loader';

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
  private targetObject: any;

  constructor() {
    OBJLoader(THREE);
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


    // Listeners
    window.addEventListener('resize', this.onResize, false);

    AssetLoader('default', assets)
      .then(this.onAssetsLoaded)
      .catch(this.onAssetsError);

    this.update();
  }

  private objectInit = () => {
    const vector = new THREE.Vector4();
    const triangles = 1;
    const instances = 15012;

    const positions: any = [];
    const offsets: any = [];
    const colors: any = [];
    const orientationsStart: any = [];
    const orientationsEnd: any = [];

    // triangle
    // positions.push(0.025, -0.025, 0);
    // positions.push(-0.025, 0.025, 0);
    // positions.push(0, 0, 0.025);

    const box = new SphereGeometry(0.01, 8, 1);
    // console.log(box);

    box.faces.forEach((face) => {
      // Vector3
      positions.push(box.vertices[face.a].x, box.vertices[face.a].y, box.vertices[face.a].z);
      positions.push(box.vertices[face.b].x, box.vertices[face.b].y, box.vertices[face.b].z);
      positions.push(box.vertices[face.c].x, box.vertices[face.c].y, box.vertices[face.c].z);
    });

    const targetOffsets = Array<object>();

    this.targetObject.children.forEach( (child) => {
      const groupBy = 3;
      child.material.wireframe = true;

      for (let i = 0; i < child.geometry.attributes.position.array.length; i = i + groupBy) {
        targetOffsets.push({
          x: child.geometry.attributes.position.array[i],
          y: child.geometry.attributes.position.array[i+1],
          z: child.geometry.attributes.position.array[i+2]
        });
      }
    });

    // instanced attributes
    for (let i = 0; i < instances; i++) {
      // offsets
      // offsets.push(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
      offsets.push(targetOffsets[i].x * 0.01, targetOffsets[i].y * 0.01, targetOffsets[i].z * 0.01);

      // colors
      colors.push(Math.random(), Math.random(), Math.random(), Math.random());

      // orientation start
      // vector.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
      vector.set(.5, .5, .5, .5);
      vector.normalize();

      orientationsStart.push(vector.x, vector.y, vector.z, vector.w);

      // orientation end
      // vector.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
      vector.set(.5, .5, .5, .5);
      vector.normalize();

      orientationsEnd.push(vector.x, vector.y, vector.z, vector.w);
    }

    const geometry = new THREE.InstancedBufferGeometry();
    geometry.maxInstancedCount = instances; // set so its initalized for dat.GUI, will be set in first draw otherwise

    geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    geometry.addAttribute('offset',
      new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3));


    geometry.addAttribute('color',
      new THREE.InstancedBufferAttribute(new Float32Array(colors), 4));
    geometry.addAttribute('orientationStart',
      new THREE.InstancedBufferAttribute(new Float32Array(orientationsStart), 4));
    geometry.addAttribute('orientationEnd',
      new THREE.InstancedBufferAttribute(new Float32Array(orientationsEnd), 4));

    // material
    const material = new RawShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        sineTime: { value: 1.0 }
      },
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent,
      side: THREE.DoubleSide,
      transparent: false
    });

    //
    const mesh = new Mesh(geometry, material);
    // mesh.rotation.y = 90;
    // mesh.scale.x = 0.3;
    // mesh.scale.z = 0.3;
    scene.add(mesh);
    //
  }

  private loadObj() {
    const manager = new LoadingManager();
    manager.onProgress = (item, loaded, total) => {
      console.log(item, loaded, total);
    };

    const onProgress = (xhr) => {
      if (xhr.lengthComputable) {
        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete) + '% downloaded');
      }
    };

    const onError = (xhr) => {
      console.log(xhr);
    };

    const loader = new THREE.OBJLoader(manager);
    loader.load('./assets/webgl/obj/male02.obj', (object) => {
      object.traverse((child) => {
        if (child instanceof Mesh) {
          // texture goes here if needed
        }
      });
      this.targetObject = object;

      this.targetObject.scale.x = 0.02;
      this.targetObject.scale.y = 0.02;
      this.targetObject.scale.z = 0.02;

      // console.log(object);

      scene.add(this.targetObject);
      this.objectInit();
    }, onProgress, onError);
  }

  private onAssetsLoaded = (value: any) => {
    console.log('assets loaded', value);

    // Objects
    this.loadObj();
    // this.objectInit();
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
    // const delta = this.clock.getDelta();
    // this.sphere.update(delta);

    const time = performance.now();

    const object = scene.children[scene.children.length - 1];

    // if (object.type === 'Mesh') {
    //   object.rotation.y = time * 0.0005;
    //   object.material.uniforms.time.value = time * 0.005;
    //   object.material.uniforms.sineTime.value = Math.sin(object.material.uniforms.time.value * 0.05);
    // }

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
