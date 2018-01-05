import Loader from './loader';

export default class JsonLoader extends Loader {
  constructor(asset) {
    super();
    this.asset = asset;
  }

  public load() {
    const req = new XMLHttpRequest();

    req.onreadystatechange = () => {
      if (req.readyState !== 4) return;

      if (req.readyState === 4 && req.status === 200) {
        this.asset.data = JSON.parse(req.responseText);
        this.emit('loaded', this.asset);
      } else {
        this.emit('error', `Failed to load ${this.asset.src}`);
      }
    };

    req.open('GET', this.asset.src, true);
    req.send();
  }
}
