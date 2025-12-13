import { useState, useCallback } from "react";

const useShare = (settings) => {
  const [shareMessage, setShareMessage] = useState("");

  const handleShare = useCallback(async () => {
    const encoded = btoa(
      JSON.stringify({
        t: settings.text,
        c: settings.color,
        f: settings.font,
        or: settings.orbitRadius,
        s: settings.speed,
        g: settings.glow,
        cs: settings.charSize,
        tt: settings.textThickness,
        ls: settings.letterSpacing,
        ra: settings.rotationAngle,
        os: settings.objectScale,
        rx: settings.objectRotationX,
        ry: settings.objectRotationY,
        rz: settings.objectRotationZ,
        oy: settings.orbitY,
      })
    );

    const url = `${window.location.origin}${window.location.pathname}?s=${encoded}`;

    try {
      await navigator.clipboard.writeText(url);
      setShareMessage("Link copied!");
    } catch {
      setShareMessage("Copy URL from address bar");
    }

    setTimeout(() => setShareMessage(""), 2000);
  }, [settings]);

  return { shareMessage, handleShare };
};

export default useShare;
