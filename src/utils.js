export const hexToRgb =
  ((hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
          result[3],
          16
        )}`
      : "90, 231, 106";
  },
  []);

export const hexToRgbString = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : "90, 231, 106";
};

export const updateGlowVariables = (color) => {
  document.documentElement.style.setProperty("--glow-color", color);
  const rgb = hexToRgbString(color);
  document.documentElement.style.setProperty("--glow-rgb", rgb);
};
export const setCSSVariable = (name, value) => {
  document.documentElement.style.setProperty(name, value);
};

export const getCSSVariable = (name) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
};
