import { simplexNoise3D } from '../../lib/shaders/noise.glsl';

export default {
  vertexShader: {
    uniforms: `
      uniform float uTime;
      varying vec3 vNormal;
    `,
    functions: `
      ${simplexNoise3D}
    `,
    preTransform: `
      float noise = simplexNoise3D(position.xyz + vec3(uTime)) * 0.25;
      transformed += normal * noise;
    `,
    postTransform: `
      vNormal = normal;
    `
  },
  fragmentShader: {
    uniforms: `
      varying vec3 vNormal;
    `,
    functions: `
    `,
    preFragColor: `
      vec3 normal = normalize(vNormal);
      outgoingLight *= (normal * 0.5 + 0.5);
    `,
    postFragColor: `
    `
  }
};
