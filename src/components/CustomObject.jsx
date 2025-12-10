import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from "three";
import { useMemo, useRef } from "react";

// Gold material settings - subtle, less glowy
const GOLD_COLOR = "#D4AF37";
const GOLD_SETTINGS = {
  color: new THREE.Color(GOLD_COLOR),
  metalness: 0.9,
  roughness: 0.35,
  envMapIntensity: 0.8,
};

function CustomObjectInner({
  scale = 0.5,
  objPath = "/models/mesh.obj",
  rotationX = 0,
  rotationY = 0,
  rotationZ = 0,
}) {
  const groupRef = useRef();

  // Load OBJ without materials - we'll apply our own gold material
  const obj = useLoader(OBJLoader, objPath);

  // Clone object and apply gold material
  const clonedObj = useMemo(() => {
    const clone = obj.clone();

    clone.traverse((child) => {
      if (child.isMesh) {
        // Replace with gold material
        child.material = new THREE.MeshStandardMaterial({
          color: GOLD_SETTINGS.color,
          metalness: GOLD_SETTINGS.metalness,
          roughness: GOLD_SETTINGS.roughness,
          envMapIntensity: GOLD_SETTINGS.envMapIntensity,
        });
      }
    });
    return clone;
  }, [obj]);

  // Calculate bounding box to center the object precisely
  const { centerOffset, normalizedScale } = useMemo(() => {
    const bbox = new THREE.Box3().setFromObject(clonedObj);
    const dimensions = new THREE.Vector3();
    bbox.getSize(dimensions);

    const center = new THREE.Vector3();
    bbox.getCenter(center);

    // Find the maximum dimension to scale uniformly
    const maxDim = Math.max(dimensions.x, dimensions.y, dimensions.z);
    // Normalize to 1 unit, then apply the user's scale
    const normalizedScale = maxDim > 0 ? scale / maxDim : scale;

    return {
      centerOffset: center.multiplyScalar(-1),
      normalizedScale,
    };
  }, [clonedObj, scale]);

  // Convert degrees to radians
  const rotX = (rotationX * Math.PI) / 180;
  const rotY = (rotationY * Math.PI) / 180;
  const rotZ = (rotationZ * Math.PI) / 180;

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[rotX, rotY, rotZ]}>
      <primitive
        object={clonedObj}
        position={[
          centerOffset.x * normalizedScale,
          centerOffset.y * normalizedScale,
          centerOffset.z * normalizedScale,
        ]}
        scale={[normalizedScale, normalizedScale, normalizedScale]}
      />
    </group>
  );
}

// Gold fallback sphere while loading or on error
function GoldSphere({ scale = 0.5 }) {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[scale * 0.5, 64, 64]} />
      <meshStandardMaterial
        color={GOLD_SETTINGS.color}
        metalness={GOLD_SETTINGS.metalness}
        roughness={GOLD_SETTINGS.roughness}
      />
    </mesh>
  );
}

// Export the inner component directly - Suspense is handled at Scene level
export default CustomObjectInner;
