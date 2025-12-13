import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const AnimatedContent = ({ children, animate }) => {
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
};

export default AnimatedContent;
