import EventEmitter from '../.././../lib/event-emitter/event-emitter';
import Asset from '../asset';

class Loader extends EventEmitter {
  public asset: Asset;
}

export default Loader;
