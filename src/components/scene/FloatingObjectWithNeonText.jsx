import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text3D, Center, Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useMediaQuery } from "../../hooks/useMediaQuery";

function DefaultSphere() {
  return (
    <mesh>
      <sphereGeometry args={[0.8, 48, 48]} />
      <meshStandardMaterial color="#ffffff" roughness={0.7} metalness={0.3} />
    </mesh>
  );
}

function Character({
  char,
  font,
  charSize,
  textThickness,
  neonColor,
  emissiveIntensity,
  position,
  rotationY,
}) {
  return (
    <group position={[position.x, 0, position.z]} rotation={[0, rotationY, 0]}>
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
}

function PointLights({ count, orbitRadius, neonColor }) {
  const lights = useMemo(() => {
    return Array.from({ length: Math.min(count, 4) }, (_, i) => {
      const angle = (i / Math.min(count, 4)) * Math.PI * 2;
      return {
        position: [
          Math.cos(angle) * orbitRadius,
          0,
          Math.sin(angle) * orbitRadius,
        ],
        intensity: 0.8 / Math.min(count, 4),
        distance: orbitRadius * 2.5,
      };
    });
  }, [count, orbitRadius]);

  return (
    <>
      {lights.map((light, i) => (
        <pointLight
          key={i}
          position={light.position}
          color={neonColor}
          intensity={light.intensity}
          distance={light.distance}
          decay={2}
        />
      ))}
    </>
  );
}

function CharacterPositions({ chars, orbitRadius, letterSpacing }) {
  return useMemo(() => {
    const count = chars.length || 1;
    const totalArc = Math.PI * 2 * letterSpacing;
    const step = totalArc / count;
    const startAngle = -totalArc / 2 + step / 2;

    return chars.map((_, i) => {
      const angle = startAngle + i * step;
      const x = Math.sin(angle) * orbitRadius;
      const z = Math.cos(angle) * orbitRadius;
      return { x, z, rotationY: Math.atan2(x, z) };
    });
  }, [chars, orbitRadius, letterSpacing]);
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
  const isMobile = useMediaQuery("(max-width: 768px)");

  const charPositions = CharacterPositions({
    chars,
    orbitRadius,
    letterSpacing,
  });

  useFrame((_, delta) => {
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <>
      <Environment preset="city" />

      <EffectComposer>
        <Bloom
          intensity={isMobile ? 0.8 : 1.2}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          height={isMobile ? 200 : 300}
        />
      </EffectComposer>

      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <directionalLight
        position={[-3, 2, -3]}
        intensity={0.5}
        color="#ffffee"
      />
      <pointLight position={[0, 3, -3]} intensity={0.8} distance={10} />

      <PointLights
        count={chars.length}
        orbitRadius={orbitRadius}
        neonColor={neonColor}
      />

      <group>
        <Object3D scale={objectScale} />
      </group>

      <group
        ref={orbitGroupRef}
        position={[0, orbitY, 0]}
        rotation={[rotationAngle, 0, 0]}
      >
        {chars.map((char, i) => (
          <Character
            key={i}
            char={char}
            font={font}
            charSize={charSize}
            textThickness={textThickness}
            neonColor={neonColor}
            emissiveIntensity={emissiveIntensity}
            position={{ x: charPositions[i].x, z: charPositions[i].z }}
            rotationY={charPositions[i].rotationY}
          />
        ))}
      </group>
    </>
  );
}
