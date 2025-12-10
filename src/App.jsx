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
};

const FONTS = [
  { name: "Helvetiker Bold", path: "/fonts/helvetiker_bold.json" },
  { name: "Helvetiker", path: "/fonts/helvetiker_regular.json" },
  { name: "Optimer Bold", path: "/fonts/optimer_bold.json" },
  { name: "Optimer", path: "/fonts/optimer_regular.json" },
  { name: "Gentilis Bold", path: "/fonts/gentilis_bold.json" },
  { name: "Gentilis", path: "/fonts/gentilis_regular.json" },
  { name: "Droid Sans Bold", path: "/fonts/droid_sans_bold.json" },
  { name: "Droid Sans", path: "/fonts/droid_sans_regular.json" },
  { name: "Droid Serif Bold", path: "/fonts/droid_serif_bold.json" },
  { name: "Droid Serif", path: "/fonts/droid_serif_regular.json" },
];

// Loading fallback
function CanvasLoader({ visible }) {
  return (
    <Html center>
      <div className={`loading-screen ${visible ? "" : "fade-out"}`}>
        <div className="loading-container">
          <div className="spinner" />
          <div className="loading-title">HALO</div>
        </div>
      </div>
    </Html>
  );
}

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
      rotationSpeed={props.speed}
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
      }, 100);
    }, 500);
  }, [onLoaded]);

  return (
    <>
      {!showContent && <CanvasLoader visible={!loaded} />}

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
    setTimeout(() => setTitleVisible(true), 200);
  }, []);

  return (
    <div className="app-root">
      <div className={`canvas-wrapper ${controlsVisible ? "shifted" : ""}`}>
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
          <div className="control-group">
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
          </div>

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
        </div>
      </div>
    </div>
  );
}
