import { DEV } from './constants';
import { getQueryFromParams } from './params';

export const debugCamera = getQueryFromParams('debugCamera') && DEV;
