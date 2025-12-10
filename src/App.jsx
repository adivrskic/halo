import React, { useState, Suspense, useRef, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import FloatingObjectWithNeonText from "./components/FloatingObjectWithNeonText";
import CustomObject from "./components/CustomObject";
import "./styles.scss";

// Halo ring icon - minimal circle
const HaloIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="8" />
  </svg>
);

// Close X icon
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

// GitHub icon - outline style
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

// Reset icon
const ResetIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

// Share icon
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

// Circular Loader Component
function CircularLoader() {
  return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="spinner" />
        <div className="loading-title">HALO</div>
      </div>
    </div>
  );
}

// Inner scene content that triggers Suspense when loading
function SceneContent({
  text,
  color,
  font,
  orbitRadius,
  orbitY,
  speed,
  glow,
  charSize,
  textThickness,
  letterSpacing,
  rotationAngle,
  objectScale,
  objectRotationX,
  objectRotationY,
  objectRotationZ,
  customObjUrl,
  onLoaded,
}) {
  // Call onLoaded when this component mounts (meaning assets are loaded)
  React.useEffect(() => {
    onLoaded?.();
  }, [onLoaded]);

  return (
    <FloatingObjectWithNeonText
      object={() => (
        <CustomObject
          scale={objectScale}
          rotationX={objectRotationX}
          rotationY={objectRotationY}
          rotationZ={objectRotationZ}
          objPath={customObjUrl}
        />
      )}
      text={text}
      color={color}
      font={font}
      orbitRadius={orbitRadius}
      orbitY={orbitY}
      rotationSpeed={speed}
      emissiveIntensity={glow}
      charSize={charSize}
      textThickness={textThickness}
      letterSpacing={letterSpacing}
      rotationAngle={rotationAngle * (Math.PI / 180)}
    />
  );
}

// Loading fallback component shown inside Canvas
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

// Animated wrapper that slides up and fades in
function AnimatedContent({ children, animate }) {
  const groupRef = useRef();
  const targetY = 0;
  const startY = -1.5;

  useFrame(() => {
    if (groupRef.current) {
      if (animate) {
        // Lerp position up
        groupRef.current.position.y +=
          (targetY - groupRef.current.position.y) * 0.04;
      } else {
        groupRef.current.position.y = startY;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, startY, 0]}>
      {children}
    </group>
  );
}

// Main Scene Component with Suspense
function Scene(props) {
  const [loaded, setLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [animateContent, setAnimateContent] = useState(false);

  const handleLoaded = () => {
    setLoaded(true);
    // Delay showing content to allow loader to fade out
    setTimeout(() => {
      setShowContent(true);
      // Start animation after content is visible
      setTimeout(() => {
        setAnimateContent(true);
        props.onLoaded?.();
      }, 100);
    }, 500);
  };

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
      {/* Preload content while loader is showing */}
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

export default function App() {
  // Default settings
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

  const [controlsVisible, setControlsVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [text, setText] = useState(DEFAULTS.text);
  const [color, setColor] = useState(DEFAULTS.color);
  const [font, setFont] = useState(DEFAULTS.font);
  const [orbitRadius, setOrbitRadius] = useState(DEFAULTS.orbitRadius);
  const [speed, setSpeed] = useState(DEFAULTS.speed);
  const [glow, setGlow] = useState(DEFAULTS.glow);
  const [charSize, setCharSize] = useState(DEFAULTS.charSize);
  const [textThickness, setTextThickness] = useState(DEFAULTS.textThickness);
  const [letterSpacing, setLetterSpacing] = useState(DEFAULTS.letterSpacing);
  const [rotationAngle, setRotationAngle] = useState(DEFAULTS.rotationAngle);
  const [objectScale, setObjectScale] = useState(DEFAULTS.objectScale);
  const [objectRotationX, setObjectRotationX] = useState(
    DEFAULTS.objectRotationX
  );
  const [objectRotationY, setObjectRotationY] = useState(
    DEFAULTS.objectRotationY
  );
  const [objectRotationZ, setObjectRotationZ] = useState(
    DEFAULTS.objectRotationZ
  );
  const [orbitY, setOrbitY] = useState(DEFAULTS.orbitY);
  const [customObjUrl, setCustomObjUrl] = useState(DEFAULTS.customObjUrl);
  const [shareMessage, setShareMessage] = useState("");

  // Reset all settings to defaults
  const handleReset = useCallback(() => {
    setText(DEFAULTS.text);
    setColor(DEFAULTS.color);
    setFont(DEFAULTS.font);
    setOrbitRadius(DEFAULTS.orbitRadius);
    setSpeed(DEFAULTS.speed);
    setGlow(DEFAULTS.glow);
    setCharSize(DEFAULTS.charSize);
    setTextThickness(DEFAULTS.textThickness);
    setLetterSpacing(DEFAULTS.letterSpacing);
    setRotationAngle(DEFAULTS.rotationAngle);
    setObjectScale(DEFAULTS.objectScale);
    setObjectRotationX(DEFAULTS.objectRotationX);
    setObjectRotationY(DEFAULTS.objectRotationY);
    setObjectRotationZ(DEFAULTS.objectRotationZ);
    setOrbitY(DEFAULTS.orbitY);
    setCustomObjUrl(DEFAULTS.customObjUrl);
  }, []);

  // Generate share URL with encoded settings
  const handleShare = useCallback(async () => {
    const settings = {
      t: text,
      c: color,
      f: font,
      or: orbitRadius,
      s: speed,
      g: glow,
      cs: charSize,
      tt: textThickness,
      ls: letterSpacing,
      ra: rotationAngle,
      os: objectScale,
      rx: objectRotationX,
      ry: objectRotationY,
      rz: objectRotationZ,
      oy: orbitY,
    };

    const encoded = btoa(JSON.stringify(settings));
    const url = `${window.location.origin}${window.location.pathname}?s=${encoded}`;

    try {
      await navigator.clipboard.writeText(url);
      setShareMessage("Link copied!");
      setTimeout(() => setShareMessage(""), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      setShareMessage("Copy URL from address bar");
      setTimeout(() => setShareMessage(""), 3000);
    }
  }, [
    text,
    color,
    font,
    orbitRadius,
    speed,
    glow,
    charSize,
    textThickness,
    letterSpacing,
    rotationAngle,
    objectScale,
    objectRotationX,
    objectRotationY,
    objectRotationZ,
    orbitY,
  ]);

  // Load settings from URL on mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("s");
    if (encoded) {
      try {
        const settings = JSON.parse(atob(encoded));
        if (settings.t) setText(settings.t);
        if (settings.c) setColor(settings.c);
        if (settings.f) setFont(settings.f);
        if (settings.or !== undefined) setOrbitRadius(settings.or);
        if (settings.s !== undefined) setSpeed(settings.s);
        if (settings.g !== undefined) setGlow(settings.g);
        if (settings.cs !== undefined) setCharSize(settings.cs);
        if (settings.tt !== undefined) setTextThickness(settings.tt);
        if (settings.ls !== undefined) setLetterSpacing(settings.ls);
        if (settings.ra !== undefined) setRotationAngle(settings.ra);
        if (settings.os !== undefined) setObjectScale(settings.os);
        if (settings.rx !== undefined) setObjectRotationX(settings.rx);
        if (settings.ry !== undefined) setObjectRotationY(settings.ry);
        if (settings.rz !== undefined) setObjectRotationZ(settings.rz);
        if (settings.oy !== undefined) setOrbitY(settings.oy);
      } catch (e) {
        console.warn("Failed to parse shared settings");
      }
    }
  }, []);

  // Available fonts
  const fonts = [
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

  const handleLoaded = () => {
    // Slight delay before showing title for smoother transition
    setTimeout(() => setTitleVisible(true), 200);
  };

  return (
    <div className="app-root">
      <div className={`canvas-wrapper ${controlsVisible ? "shifted" : ""}`}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          style={{ width: "100vw", height: "100vh" }}
        >
          <color attach="background" args={["#000000"]} />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
          <pointLight
            position={[-10, -10, -10]}
            intensity={0.5}
            color="#ffffff"
          />

          {/* Camera controls - drag to rotate */}
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

          <Scene
            text={text}
            color={color}
            font={font}
            orbitRadius={orbitRadius}
            orbitY={orbitY}
            speed={speed}
            glow={glow}
            charSize={charSize}
            textThickness={textThickness}
            letterSpacing={letterSpacing}
            rotationAngle={rotationAngle}
            objectScale={objectScale}
            objectRotationX={objectRotationX}
            objectRotationY={objectRotationY}
            objectRotationZ={objectRotationZ}
            customObjUrl={customObjUrl}
            onLoaded={handleLoaded}
          />
        </Canvas>
      </div>

      {/* Bottom bar with title and menu button */}
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

        {/* Share message toast */}
        {shareMessage && <div className="share-toast">{shareMessage}</div>}
      </div>

      {/* Control Panel */}
      <div className={`control-panel ${controlsVisible ? "visible" : ""}`}>
        <div className="panel-content">
          {/* Text Input */}
          <div className="control-group">
            <div className="control-label">
              <span className="label-text">Text</span>
              <span className="label-value">{text.length}</span>
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text..."
                maxLength={20}
              />
            </div>
          </div>

          {/* Color Picker */}
          <div className="control-group">
            <div className="control-label">
              <span className="label-text">Color</span>
              <span className="label-value">{color}</span>
            </div>
            <div className="color-picker">
              <div className="color-swatch">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <div
                  className="color-preview"
                  style={{ backgroundColor: color }}
                />
              </div>
              <div className="input-wrapper color-input">
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
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
                value={font}
                onChange={(e) => setFont(e.target.value)}
                className="font-select"
              >
                {fonts.map((f) => (
                  <option key={f.path} value={f.path}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Object URL */}
          <div className="control-group">
            <div className="control-label">
              <span className="label-text">Object URL</span>
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                value={customObjUrl}
                onChange={(e) => setCustomObjUrl(e.target.value)}
                placeholder="/models/mesh.obj"
              />
            </div>
            <div className="hint-text">Path to .obj file</div>
          </div>

          {/* Object Controls */}
          <div className="control-group">
            <div className="control-label">
              <span className="label-text">Object Scale</span>
              <span className="label-value">{objectScale.toFixed(2)}</span>
            </div>
            <div className="input-wrapper">
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.05"
                value={objectScale}
                onChange={(e) => setObjectScale(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span className="label-text">Object Rotate X</span>
              <span className="label-value">{objectRotationX}°</span>
            </div>
            <div className="input-wrapper">
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={objectRotationX}
                onChange={(e) => setObjectRotationX(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span className="label-text">Object Rotate Y</span>
              <span className="label-value">{objectRotationY}°</span>
            </div>
            <div className="input-wrapper">
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={objectRotationY}
                onChange={(e) => setObjectRotationY(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span className="label-text">Object Rotate Z</span>
              <span className="label-value">{objectRotationZ}°</span>
            </div>
            <div className="input-wrapper">
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={objectRotationZ}
                onChange={(e) => setObjectRotationZ(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Orbit Controls */}
          <div className="control-group">
            <div className="control-label">
              <span className="label-text">Orbit Plane</span>
              <span className="label-value">{rotationAngle}°</span>
            </div>
            <div className="input-wrapper">
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={rotationAngle}
                onChange={(e) => setRotationAngle(Number(e.target.value))}
              />
            </div>
            <div className="hint-text">0° horizontal · 90° vertical</div>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span className="label-text">Orbit Height</span>
              <span className="label-value">{orbitY.toFixed(2)}</span>
            </div>
            <div className="input-wrapper">
              <input
                type="range"
                min="-2"
                max="2"
                step="0.05"
                value={orbitY}
                onChange={(e) => setOrbitY(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span className="label-text">Orbit Radius</span>
              <span className="label-value">{orbitRadius.toFixed(2)}</span>
            </div>
            <div className="input-wrapper">
              <input
                type="range"
                min="0.2"
                max="4"
                step="0.05"
                value={orbitRadius}
                onChange={(e) => setOrbitRadius(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span className="label-text">Orbit Speed</span>
              <span className="label-value">{speed.toFixed(2)}</span>
            </div>
            <div className="input-wrapper">
              <input
                type="range"
                min="0"
                max="1.2"
                step="0.01"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span className="label-text">Letter Spread</span>
              <span className="label-value">
                {(letterSpacing * 100).toFixed(0)}%
              </span>
            </div>
            <div className="input-wrapper">
              <input
                type="range"
                min="0.2"
                max="1"
                step="0.05"
                value={letterSpacing}
                onChange={(e) => setLetterSpacing(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Text Appearance */}
          <div className="control-group">
            <div className="control-label">
              <span className="label-text">Character Size</span>
              <span className="label-value">{charSize.toFixed(2)}</span>
            </div>
            <div className="input-wrapper">
              <input
                type="range"
                min="0.12"
                max="0.6"
                step="0.01"
                value={charSize}
                onChange={(e) => setCharSize(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span className="label-text">Text Thickness</span>
              <span className="label-value">{textThickness.toFixed(2)}</span>
            </div>
            <div className="input-wrapper">
              <input
                type="range"
                min="0.02"
                max="0.3"
                step="0.01"
                value={textThickness}
                onChange={(e) => setTextThickness(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span className="label-text">Glow Intensity</span>
              <span className="label-value">{glow.toFixed(1)}</span>
            </div>
            <div className="input-wrapper">
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={glow}
                onChange={(e) => setGlow(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
