// https://github.com/dataarts/dat.gui/issues/142
import { GUI } from 'dat.gui/build/dat.gui.js';
import { DEV_GUI } from '../constants';
import { IS_DESKTOP } from '../platform';

class Folder {
  public add() {
    return this;
  }
  public listen() {
    return this;
  }
  public name() {
    return this;
  }
  public open() {
    return this;
  }
  public close() {
    return this;
  }
  public onChange() {
    return this;
  }
  public addFolder() {
    return this;
  }
  public addColor() {
    return this;
  }
  public removeFolder() {
    return this;
  }
  public remove() {
    return this;
  }
  public step() {
    return this;
  }
}

class GUIWrapper {
  public add() {
    return this;
  }
  public addFolder() {
    return new Folder();
  }
  public removeFolder() {
    return this;
  }
  public addColor() {
    return this;
  }
  public listen() {
    return this;
  }
  public name() {
    return this;
  }
  public close() {
    return this;
  }
  public step() {
    return this;
  }
  public onChange() {
    return this;
  }
  public setValue() {
    return this;
  }
  public remove() {
    return this;
  }
  public open() {
    return this;
  }
}

let Cls = GUI;

if (!DEV_GUI) {
  Cls = GUIWrapper;
}

export const gui = new Cls();
export const guiFlags = gui.addFolder('flags');
export const guiLights = gui.addFolder('lights');
export { GUIWrapper };

gui.open();
guiFlags.open();
// guiLights.open();

if (!IS_DESKTOP) {
  GUI.toggleHide();
}
