import React, { useState, useCallback, Suspense } from "react";
import AnimatedContent from "./AnimatedContent";
import SceneContent from "./SceneContent";

const SceneManager = ({ onLoaded, ...props }) => {
  const [, setLoaded] = useState(false);
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

      {!showContent && (
        <group visible={false}>
          <Suspense fallback={null}>
            <SceneContent {...props} onLoaded={handleLoaded} />
          </Suspense>
        </group>
      )}
    </>
  );
};

export default SceneManager;
