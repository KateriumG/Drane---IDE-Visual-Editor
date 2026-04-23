export function snap(value, size) {
  return Math.round(value / size) * size;
}