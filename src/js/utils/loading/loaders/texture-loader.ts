import { TextureLoader } from 'three';
import Loader from './loader';

export default class WebGLTextureLoader extends Loader {
  constructor(asset) {
    super();
    this.asset = asset;
  }

  public load() {
    const loader = new TextureLoader();

    const onLoaded = texture => {
      this.asset.data = texture;
      this.emit('loaded', this.asset);
    };

    function onProgress() {
      return;
    }

    const onError = () => {
      this.emit('error', `Failed to load ${this.asset.src}`);
    };

    loader.load(this.asset.src, onLoaded, onProgress, onError);
  }
}
