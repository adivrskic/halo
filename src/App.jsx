import React, {
  useState,
  Suspense,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import FloatingObjectWithNeonText from "./components/FloatingObjectWithNeonText";
import CustomObject from "./components/CustomObject";
import "./styles.scss";

// Icons
const HaloIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="8" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const GitHubIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const ShareIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

// Halo Logo SVG for loader
const HaloLogo = () => (
  <svg viewBox="0 0 94 94" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M38.0481 4.82927C38.0481 2.16214 40.018 0 42.4481 0H51.2391C53.6692 0 55.6391 2.16214 55.6391 4.82927V40.1401C55.6391 48.8912 53.2343 55.6657 48.4248 60.4636C43.6153 65.2277 36.7304 67.6098 27.7701 67.6098C18.8099 67.6098 11.925 65.2953 7.11548 60.6663C2.37183 56.0036 3.8147e-06 49.2967 3.8147e-06 40.5456V4.82927C3.8147e-06 2.16213 1.96995 0 4.4 0H13.2405C15.6705 0 17.6405 2.16214 17.6405 4.82927V39.1265C17.6405 43.7892 18.4805 47.2018 20.1605 49.3642C21.8735 51.5267 24.4759 52.6079 27.9678 52.6079C31.4596 52.6079 34.0127 51.5436 35.6268 49.4149C37.241 47.2863 38.0481 43.8399 38.0481 39.0758V4.82927Z" />
    <path d="M86.9 61.8682C86.9 64.5353 84.9301 66.6975 82.5 66.6975H73.6595C71.2295 66.6975 69.2595 64.5353 69.2595 61.8682V4.82927C69.2595 2.16214 71.2295 0 73.6595 0H82.5C84.9301 0 86.9 2.16214 86.9 4.82927V61.8682Z" />
    <path d="M2.86102e-06 83.2195C2.86102e-06 80.5524 1.96995 78.3902 4.4 78.3902H83.6C86.0301 78.3902 88 80.5524 88 83.2195V89.1707C88 91.8379 86.0301 94 83.6 94H4.4C1.96995 94 0 91.8379 0 89.1707L2.86102e-06 83.2195Z" />
  </svg>
);

// Ripple Loader Component
function RippleLoader({ visible }) {
  return (
    <div className={`loader-overlay ${visible ? "" : "fade-out"}`}>
      <div className="loader">
        <div className="box">
          <p className="logo">HALO</p>
        </div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div>
    </div>
  );
}

// Default configuration
const DEFAULTS = {
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

const FONTS = [
  { name: "Helvetiker Bold", path: "/fonts/helvetiker_bold.json" },
  { name: "Helvetiker", path: "/fonts/helvetiker_regular.json" },
  { name: "Optimer Bold", path: "/fonts/optimer_bold.json" },
  { name: "Optimer", path: "/fonts/optimer_regular.json" },
  { name: "Gentilis Bold", path: "/fonts/gentilis_bold.json" },
  { name: "Gentilis", path: "/fonts/gentilis_regular.json" },
];

// Animated entrance wrapper
function AnimatedContent({ children, animate }) {
  const groupRef = useRef();
  const targetY = 0.5;
  const startY = -1.5;

  useFrame(() => {
    if (groupRef.current) {
      const currentY = groupRef.current.position.y;
      const newY = animate ? currentY + (targetY - currentY) * 0.04 : startY;
      groupRef.current.position.y = newY;
    }
  });

  return (
    <group ref={groupRef} position={[0, startY, 0]}>
      {children}
    </group>
  );
}

// Scene content
function SceneContent({ onLoaded, ...props }) {
  useEffect(() => {
    onLoaded?.();
  }, [onLoaded]);

  const directionMultiplier = props.reverseDirection ? -1 : 1;

  return (
    <FloatingObjectWithNeonText
      object={() => (
        <CustomObject
          scale={props.objectScale}
          rotationX={props.objectRotationX}
          rotationY={props.objectRotationY}
          rotationZ={props.objectRotationZ}
          objPath={props.customObjUrl}
        />
      )}
      text={props.text}
      color={props.color}
      font={props.font}
      orbitRadius={props.orbitRadius}
      orbitY={props.orbitY}
      rotationSpeed={props.speed * directionMultiplier}
      emissiveIntensity={props.glow}
      charSize={props.charSize}
      textThickness={props.textThickness}
      letterSpacing={props.letterSpacing}
      rotationAngle={props.rotationAngle * (Math.PI / 180)}
    />
  );
}

// Main scene with loading states
function Scene({ onLoaded, ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [animateContent, setAnimateContent] = useState(false);

  const handleLoaded = useCallback(() => {
    setLoaded(true);
    setTimeout(() => {
      setShowContent(true);
      setTimeout(() => {
        setAnimateContent(true);
        onLoaded?.();
      }, 1500);
    }, 1500);
  }, [onLoaded]);

  return (
    <>
      {showContent && (
        <AnimatedContent animate={animateContent}>
          <Suspense fallback={null}>
            <SceneContent {...props} onLoaded={handleLoaded} />
          </Suspense>
        </AnimatedContent>
      )}

      {/* Preload while loader shows */}
      {!showContent && (
        <group visible={false}>
          <Suspense fallback={null}>
            <SceneContent {...props} onLoaded={handleLoaded} />
          </Suspense>
        </group>
      )}
    </>
  );
}

// Slider control component
function SliderControl({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = "",
  hint,
}) {
  const displayValue =
    typeof value === "number"
      ? unit === "%"
        ? `${(value * 100).toFixed(0)}%`
        : `${value.toFixed(2)}${unit}`
      : value;

  return (
    <div className="control-group">
      <div className="control-label">
        <span className="label-text">{label}</span>
        <span className="label-value">{displayValue}</span>
      </div>
      <div className="input-wrapper">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
      {hint && <div className="hint-text">{hint}</div>}
    </div>
  );
}

export default function App() {
  const [controlsVisible, setControlsVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Scene settings state
  const [settings, setSettings] = useState(DEFAULTS);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Reset all settings
  const handleReset = useCallback(() => {
    setSettings(DEFAULTS);
  }, []);

  // Share URL generation
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

  // Load settings from URL
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

  const handleLoaded = useCallback(() => {
    setTimeout(() => {
      setLoading(false);
      setTimeout(() => setTitleVisible(true), 200);
    }, 300);
  }, []);

  return (
    <div className="app-root">
      {/* Full-screen Ripple Loader */}
      <RippleLoader visible={loading} />

      <div className={`canvas-wrapper`}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          style={{ width: "100vw", height: "100vh" }}
        >
          <color attach="background" args={["#000000"]} />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={12}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI - Math.PI / 4}
            dampingFactor={0.05}
            enableDamping={true}
          />

          <Scene {...settings} onLoaded={handleLoaded} />
        </Canvas>
      </div>

      {/* Bottom bar */}
      <div className="bottom-bar">
        <div className={`app-title ${titleVisible ? "visible" : ""}`}>
          <div className="title-text">HALO</div>
        </div>

        <div className={`bottom-bar-right ${titleVisible ? "visible" : ""}`}>
          <button
            className="icon-link"
            onClick={handleShare}
            title="Copy share link"
          >
            <ShareIcon />
          </button>

          <a
            href="https://github.com/adivrskic"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link"
          >
            <GitHubIcon />
          </a>

          <button
            className={`control-button ${controlsVisible ? "active" : ""}`}
            onClick={() => setControlsVisible(!controlsVisible)}
          >
            {controlsVisible ? <CloseIcon /> : <HaloIcon />}
          </button>
        </div>

        {shareMessage && <div className="share-toast">{shareMessage}</div>}
      </div>

      {/* Control Panel */}
      <div className={`control-panel ${controlsVisible ? "visible" : ""}`}>
        <div className="panel-content">
          {/* Text Input */}
          <div className="control-group">
            <div className="control-label">
              <span className="label-text">Text</span>
              <span className="label-value">{settings.text.length}</span>
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                value={settings.text}
                onChange={(e) => updateSetting("text", e.target.value)}
                placeholder="Enter text..."
                maxLength={20}
              />
            </div>
          </div>

          {/* Color Picker */}
          <div className="control-group">
            <div className="control-label">
              <span className="label-text">Color</span>
              <span className="label-value">{settings.color}</span>
            </div>
            <div className="color-picker">
              <div className="color-swatch">
                <input
                  type="color"
                  value={settings.color}
                  onChange={(e) => updateSetting("color", e.target.value)}
                />
                <div
                  className="color-preview"
                  style={{ backgroundColor: settings.color }}
                />
              </div>
              <div className="input-wrapper color-input">
                <input
                  type="text"
                  value={settings.color}
                  onChange={(e) => updateSetting("color", e.target.value)}
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>

          {/* Font Selector */}
          <div className="control-group">
            <div className="control-label">
              <span className="label-text">Font</span>
            </div>
            <div className="input-wrapper">
              <select
                value={settings.font}
                onChange={(e) => updateSetting("font", e.target.value)}
                className="font-select"
              >
                {FONTS.map((f) => (
                  <option key={f.path} value={f.path}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Object URL */}
          {/* <div className="control-group">
            <div className="control-label">
              <span className="label-text">Object URL</span>
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                value={settings.customObjUrl}
                onChange={(e) => updateSetting("customObjUrl", e.target.value)}
                placeholder="/models/mesh.obj"
              />
            </div>
            <div className="hint-text">Path to .obj file</div>
          </div> */}

          {/* Sliders */}
          <SliderControl
            label="Object Scale"
            value={settings.objectScale}
            onChange={(v) => updateSetting("objectScale", v)}
            min={0.1}
            max={3}
            step={0.05}
          />

          <SliderControl
            label="Object Rotate X"
            value={settings.objectRotationX}
            onChange={(v) => updateSetting("objectRotationX", v)}
            min={-180}
            max={180}
            step={1}
            unit="°"
          />

          <SliderControl
            label="Object Rotate Y"
            value={settings.objectRotationY}
            onChange={(v) => updateSetting("objectRotationY", v)}
            min={-180}
            max={180}
            step={1}
            unit="°"
          />

          <SliderControl
            label="Object Rotate Z"
            value={settings.objectRotationZ}
            onChange={(v) => updateSetting("objectRotationZ", v)}
            min={-180}
            max={180}
            step={1}
            unit="°"
          />

          <SliderControl
            label="Orbit Plane"
            value={settings.rotationAngle}
            onChange={(v) => updateSetting("rotationAngle", v)}
            min={0}
            max={360}
            step={1}
            unit="°"
            hint="0° horizontal · 90° vertical"
          />

          <SliderControl
            label="Orbit Height"
            value={settings.orbitY}
            onChange={(v) => updateSetting("orbitY", v)}
            min={-2}
            max={2}
            step={0.05}
          />

          <SliderControl
            label="Orbit Radius"
            value={settings.orbitRadius}
            onChange={(v) => updateSetting("orbitRadius", v)}
            min={0.2}
            max={4}
            step={0.05}
          />

          <SliderControl
            label="Orbit Speed"
            value={settings.speed}
            onChange={(v) => updateSetting("speed", v)}
            min={0}
            max={1.2}
            step={0.01}
          />

          <SliderControl
            label="Letter Spread"
            value={settings.letterSpacing}
            onChange={(v) => updateSetting("letterSpacing", v)}
            min={0.2}
            max={1}
            step={0.05}
            unit="%"
          />

          <SliderControl
            label="Character Size"
            value={settings.charSize}
            onChange={(v) => updateSetting("charSize", v)}
            min={0.12}
            max={0.6}
            step={0.01}
          />

          <SliderControl
            label="Text Thickness"
            value={settings.textThickness}
            onChange={(v) => updateSetting("textThickness", v)}
            min={0.02}
            max={0.3}
            step={0.01}
          />

          <SliderControl
            label="Glow Intensity"
            value={settings.glow}
            onChange={(v) => updateSetting("glow", v)}
            min={0}
            max={5}
            step={0.1}
          />
          <div className="control-group">
            <div className="control-label">
              <span className="label-text">Reverse Direction</span>
            </div>
            <div className="toggle-wrapper">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.reverseDirection}
                  onChange={(e) =>
                    updateSetting("reverseDirection", e.target.checked)
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="hint-text">Flip text orbit direction</div>
          </div>
        </div>
      </div>
    </div>
  );
}
