import { useEffect } from "react";
import { hexToRgbString } from "../utils";

export const useGlowEffect = (color) => {
  useEffect(() => {
    document.documentElement.style.setProperty("--glow-color", color);
    const rgb = hexToRgbString(color);
    document.documentElement.style.setProperty("--glow-rgb", rgb);
  }, [color]);
};
