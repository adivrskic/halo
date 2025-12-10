import React, { useState, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
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
  const startY = -0.125;

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
  const [controlsVisible, setControlsVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [text, setText] = useState("THE HALO EFFECT");
  const [color, setColor] = useState("#5ae76a");
  const [font, setFont] = useState("/fonts/helvetiker_bold.json");
  const [orbitRadius, setOrbitRadius] = useState(0.4);
  const [speed, setSpeed] = useState(0.5);
  const [glow, setGlow] = useState(3.0);
  const [charSize, setCharSize] = useState(0.14);
  const [textThickness, setTextThickness] = useState(0.02);
  const [letterSpacing, setLetterSpacing] = useState(0.7);
  const [rotationAngle, setRotationAngle] = useState(327);
  const [objectScale, setObjectScale] = useState(2);
  const [objectRotationX, setObjectRotationX] = useState(-106);
  const [objectRotationY, setObjectRotationY] = useState(10);
  const [objectRotationZ, setObjectRotationZ] = useState(167);
  const [orbitY, setOrbitY] = useState(0.75);
  const [customObjUrl, setCustomObjUrl] = useState("/models/mesh.obj");

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
          <a
            href="https://github.com/xrayzh"
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
