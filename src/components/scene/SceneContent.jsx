import React, { useEffect } from "react";
import FloatingObjectWithNeonText from "./FloatingObjectWithNeonText";
import CustomObject from "./CustomObject";

const SceneContent = ({ onLoaded, ...props }) => {
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
};

export default SceneContent;
