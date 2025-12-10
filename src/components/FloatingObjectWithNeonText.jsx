import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text3D, Center, Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// Debounce hook
function useDebouncedValue(value, delay = 200) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

// Check if mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

export default function FloatingObjectWithNeonText({
  object: Object3D = DefaultSphere,
  text = "HALO",
  color = "#ffffff",
  font = "/fonts/helvetiker_bold.json",
  orbitRadius = 2.2,
  orbitY = 0,
  rotationSpeed = 0.08,
  emissiveIntensity = 3.0,
  charSize = 0.32,
  textThickness = 0.15,
  letterSpacing = 0.8,
  rotationAngle = 0,
  objectScale = 0.5,
}) {
  const orbitGroupRef = useRef();
  const chars = useDebouncedValue(Array.from(text));
  const neonColor = useMemo(() => new THREE.Color(color), [color]);
  const isMobile = useIsMobile();

  // Add dynamic lighting that matches the text color
  const pointLights = useMemo(() => {
    const lights = [];
    const N = Math.min(chars.length, 4);

    for (let i = 0; i < N; i++) {
      const angle = (i / N) * Math.PI * 2;
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;

      lights.push({
        position: [x, 0, z],
        intensity: 0.8 / N,
        distance: orbitRadius * 2.5,
        decay: 2,
      });
    }

    return lights;
  }, [chars.length, orbitRadius]);

  // Compute letter positions for circular arrangement
  const charData = useMemo(() => {
    const N = chars.length || 1;
    const totalArc = Math.PI * 2 * letterSpacing;
    const step = totalArc / N;
    const startAngle = -totalArc / 2 + step / 2;

    return chars.map((_, i) => {
      const angle = startAngle + i * step;
      return {
        angle,
        x: Math.sin(angle) * orbitRadius,
        z: Math.cos(angle) * orbitRadius,
      };
    });
  }, [chars, orbitRadius, letterSpacing]);

  // Animate the orbiting text
  useFrame((_, delta) => {
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <>
      {/* Environment map for realistic reflections */}
      <Environment preset="city" />

      {/* Bloom effect - reduced on mobile for performance */}
      <EffectComposer>
        <Bloom
          intensity={isMobile ? 1.0 : 1.6}
          luminanceThreshold={0.0}
          luminanceSmoothing={0.9}
          height={isMobile ? 200 : 300}
        />
      </EffectComposer>

      {/* Ambient light - for overall scene */}
      <ambientLight intensity={0.3} />

      {/* Key light - main illumination for gold object */}
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />

      {/* Fill light - softer, from opposite side */}
      <directionalLight
        position={[-3, 2, -3]}
        intensity={0.5}
        color="#ffffee"
      />

      {/* Rim light - adds edge definition */}
      <pointLight
        position={[0, 3, -3]}
        intensity={0.8}
        color="#ffffff"
        distance={10}
      />

      {/* Colored lights from text glow */}
      {pointLights.map((light, i) => (
        <pointLight
          key={i}
          position={light.position}
          color={neonColor}
          intensity={light.intensity}
          distance={light.distance}
          decay={light.decay}
        />
      ))}

      {/* Central object - positioned at exact center (0,0,0) */}
      <group position={[0, 0, 0]}>
        <Object3D scale={objectScale} />
      </group>

      {/* Orbiting letters - rotates around Y axis, positioned at orbitY height */}
      <group
        ref={orbitGroupRef}
        position={[0, orbitY, 0]}
        rotation={[rotationAngle, 0, 0]}
      >
        {chars.map((char, i) => {
          const { angle, x, z } = charData[i];
          return (
            <group
              key={i}
              position={[x, 0, z]}
              rotation={[0, angle + Math.PI, 0]}
            >
              <Center>
                <Text3D
                  font={font}
                  size={charSize}
                  height={textThickness}
                  bevelEnabled
                  bevelThickness={0.02}
                  bevelSize={0.01}
                  bevelSegments={3}
                >
                  {char}
                  <meshStandardMaterial
                    color="#ffffff"
                    emissive={neonColor}
                    emissiveIntensity={emissiveIntensity}
                    toneMapped={false}
                    roughness={0.2}
                    metalness={0.1}
                  />
                </Text3D>
              </Center>
            </group>
          );
        })}
      </group>
    </>
  );
}

// Default central object (fallback) - centered and stationary
function DefaultSphere() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[0.8, 48, 48]} />
      <meshStandardMaterial color="#ffffff" roughness={0.7} metalness={0.3} />
    </mesh>
  );
}
