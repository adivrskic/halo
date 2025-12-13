import React, { useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// Components
import RippleLoader from "./components/ui/RippleLoader";
import SceneManager from "./components/scene/SceneManager";
import ControlPanel from "./components/ui/ControlPanel";
import BottomBar from "./components/ui/BottomBar";
import ShareToast from "./components/ui/ShareToast";

// Hooks
import useSettings, { FONTS } from "./hooks/useSettings";
import useShare from "./hooks/useShare";
import { useGlowEffect } from "./hooks/useGlowEffect";

// Styles
import "./styles.scss";

export default function App() {
  const [controlsVisible, setControlsVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const { settings, updateSetting } = useSettings();
  const { shareMessage, handleShare } = useShare(settings);

  // Apply glow effect based on selected color
  useGlowEffect(settings.color);

  const handleLoaded = useCallback(() => {
    setTimeout(() => {
      setLoading(false);
      setTimeout(() => setTitleVisible(true), 200);
    }, 300);
  }, []);

  const handleToggleControls = () => {
    setControlsVisible(!controlsVisible);
  };

  return (
    <div className="app-root">
      <RippleLoader visible={loading} />

      <div className="canvas-wrapper">
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

          <SceneManager {...settings} onLoaded={handleLoaded} />
        </Canvas>
      </div>

      <BottomBar
        titleVisible={titleVisible}
        controlsVisible={controlsVisible}
        onShare={handleShare}
        onToggleControls={handleToggleControls}
      />

      <ShareToast message={shareMessage} visible={!!shareMessage} />

      <ControlPanel
        settings={settings}
        updateSetting={updateSetting}
        fonts={FONTS}
        visible={controlsVisible}
      />
    </div>
  );
}
