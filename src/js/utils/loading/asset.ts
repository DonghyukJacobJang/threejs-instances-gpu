const deepExtend = require('deep-extend');

interface AssetConfig {
  id: string;
  src: string;
  type: string;
  args?: any;
  data?: any;
}

export default class Asset {
  public id: string;
  public src: string;
  public type: string;
  public args: any;
  public data: any;
  constructor(config: AssetConfig) {
    deepExtend(this, config);
  }
}
