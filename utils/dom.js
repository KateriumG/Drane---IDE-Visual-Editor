export function rgbToHex(rgb) {
  if (!rgb) return "#ffffff";
  if (rgb.startsWith("#")) return rgb;

  const result = rgb.match(/\d+/g);
  if (!result) return "#ffffff";

  return "#" + result.map(x =>
    parseInt(x).toString(16).padStart(2, "0")
  ).join("");
}