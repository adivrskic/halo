import { useState, useEffect } from "react";

export const DEFAULTS = {
  text: "THE HALO EFFECT",
  color: "#5ae76a",
  font: "/fonts/helvetiker_bold.json",
  orbitRadius: 0.4,
  speed: 0.5,
  glow: 3.0,
  charSize: 0.14,
  textThickness: 0.02,
  letterSpacing: 0.7,
  rotationAngle: 327,
  objectScale: 2,
  objectRotationX: -106,
  objectRotationY: 10,
  objectRotationZ: 167,
  orbitY: 0.75,
  customObjUrl: "/models/mesh.obj",
  reverseDirection: false,
};

export const FONTS = [
  { name: "Helvetiker Bold", path: "/fonts/helvetiker_bold.json" },
  { name: "Helvetiker", path: "/fonts/helvetiker_regular.json" },
  { name: "Optimer Bold", path: "/fonts/optimer_bold.json" },
  { name: "Optimer", path: "/fonts/optimer_regular.json" },
  { name: "Gentilis Bold", path: "/fonts/gentilis_bold.json" },
  { name: "Gentilis", path: "/fonts/gentilis_regular.json" },
];

const useSettings = () => {
  const [settings, setSettings] = useState(DEFAULTS);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("s");

    if (encoded) {
      try {
        const s = JSON.parse(atob(encoded));
        setSettings((prev) => ({
          ...prev,
          ...(s.t && { text: s.t }),
          ...(s.c && { color: s.c }),
          ...(s.f && { font: s.f }),
          ...(s.or !== undefined && { orbitRadius: s.or }),
          ...(s.s !== undefined && { speed: s.s }),
          ...(s.g !== undefined && { glow: s.g }),
          ...(s.cs !== undefined && { charSize: s.cs }),
          ...(s.tt !== undefined && { textThickness: s.tt }),
          ...(s.ls !== undefined && { letterSpacing: s.ls }),
          ...(s.ra !== undefined && { rotationAngle: s.ra }),
          ...(s.os !== undefined && { objectScale: s.os }),
          ...(s.rx !== undefined && { objectRotationX: s.rx }),
          ...(s.ry !== undefined && { objectRotationY: s.ry }),
          ...(s.rz !== undefined && { objectRotationZ: s.rz }),
          ...(s.oy !== undefined && { orbitY: s.oy }),
        }));
      } catch {
        console.warn("Failed to parse shared settings");
      }
    }
  }, []);

  return { settings, updateSetting };
};

export default useSettings;
