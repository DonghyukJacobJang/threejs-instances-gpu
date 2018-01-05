import Asset from './asset';
import GroupLoader from './loaders/group-loader';

export default function load(id, assets) {
  return new Promise((resolve, reject) => {
    const loader = new GroupLoader(id);
    const manifest = new Array<Asset>();
    assets.forEach(asset => {
      if (asset.args === undefined) {
        asset.args = {};
      }
      manifest.push(
        new Asset({
          id: asset.id,
          src: asset.src,
          type: asset.type,
          args: asset.args
        })
      );
    });

    loader.once('loaded', response => {
      resolve(response);
    });

    loader.once('error', error => {
      reject(error);
    });

    loader.load(manifest);
  });
}
