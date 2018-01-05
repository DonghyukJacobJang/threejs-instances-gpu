const ee = require('event-emitter');

// Is there a better way?!

class EventEmitter {
  public emit: (listener: string, ...args: any[]) => void;
  public off: (type: string, listener: (...args: any[]) => void) => void;
  public on: (type: string, listener: (...args: any[]) => void) => void;
  public once: (type: string, listener: (...args: any[]) => void) => void;
  constructor() {
    ee(this);
  }
}

export default EventEmitter;
