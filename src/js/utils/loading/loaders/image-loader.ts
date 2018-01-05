import Loader from './loader';

export default class ImageLoader extends Loader {
  constructor(asset) {
    super();
    this.asset = asset;
  }

  public load() {
    const image = new Image();

    image.onload = () => {
      this.asset.data = image;
      this.emit('loaded', this.asset);
    };

    image.onerror = () => {
      this.emit('error', `Failed to load ${this.asset.src}`);
    };

    image.src = this.asset.src;
  }
}
