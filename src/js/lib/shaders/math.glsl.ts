export const definePI = `
#define PI 3.141592653589793
`;

export const definePITwo = `
#define TWO_PI 6.283185307179586
`;

export const mapLinear = `
float mapLinear(float value, float in_min, float in_max, float out_min, float out_max) {
	return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
`;

export default {
  definePI,
  definePITwo,
  mapLinear
};
