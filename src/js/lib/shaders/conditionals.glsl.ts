export const whenEquals = `
float whenEquals(float x, float y) {
  return 1.0 - abs(sign(x - y));
};
`;

export const whenEqualsInt = `
int whenEqualsInt(int x, int y) {
  return 1 - abs(sign(x - y));
}
`;

export const whenLessThan = `
float whenLessThan(float x, float y) {
  return max(sign(y - x), 0.0);
}
`;

export const whenGreaterThan = `
float whenGreaterThan(float x, float y) {
  return max(sign(x - y), 0.0);
}
`;

export default {
  whenEquals,
  whenEqualsInt,
  whenLessThan,
  whenGreaterThan
};
