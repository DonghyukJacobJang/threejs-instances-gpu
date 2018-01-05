import { UAParser } from 'ua-parser-js';

const parser = new UAParser();
const ua = parser.getResult();

const device = ua.device;
const browser = ua.browser;
const os = ua.os;

// Devices
export const IS_DESKTOP = !device.type;
export const IS_MOBILE = device.type === 'mobile';
export const IS_TABLET = device.type === 'tablet';

export const IS_IPAD = IS_TABLET && device.vendor === 'Apple';
export const IS_IPHONE = IS_MOBILE && device.vendor === 'Apple';

// OSs
export const IOS_VERSION = os.name === 'iOS' ? os.version : null;

// Browsers
export const IS_CHROME =
  browser.name === 'Chrome' || browser.name === 'Chromium';
export const IS_IE =
  browser.name === 'IE' ||
  browser.name === 'IE Mobile' ||
  browser.name === 'Edge';
export const IS_SAFARI =
  browser.name === 'Safari' || browser.name === 'Mobile Safari';
export const IS_FIREFOX =
  browser.name === 'Firefox' || browser.name === 'Mozilla';
