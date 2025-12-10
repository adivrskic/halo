import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from "three";
import { useMemo, useRef } from "react";

// Gold material - subtle reflections for better text readability
const GOLD_MATERIAL_CONFIG = {
  color: new THREE.Color("#B8860B"),
  metalness: 0.85,
  roughness: 0.5,
  envMapIntensity: 0.2,
};

export default function CustomObject({
  scale = 0.5,
  objPath = "/models/mesh.obj",
  rotationX = 0,
  rotationY = 0,
  rotationZ = 0,
}) {
  const groupRef = useRef();
  const obj = useLoader(OBJLoader, objPath);

  // Clone and apply gold material
  const clonedObj = useMemo(() => {
    const clone = obj.clone();
    const material = new THREE.MeshStandardMaterial(GOLD_MATERIAL_CONFIG);

    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
      }
    });

    return clone;
  }, [obj]);

  // Calculate centering offset and normalized scale
  const { centerOffset, normalizedScale } = useMemo(() => {
    const bbox = new THREE.Box3().setFromObject(clonedObj);
    const dimensions = new THREE.Vector3();
    const center = new THREE.Vector3();

    bbox.getSize(dimensions);
    bbox.getCenter(center);

    const maxDim = Math.max(dimensions.x, dimensions.y, dimensions.z);
    const normalized = maxDim > 0 ? scale / maxDim : scale;

    return {
      centerOffset: center.multiplyScalar(-1),
      normalizedScale: normalized,
    };
  }, [clonedObj, scale]);

  // Convert degrees to radians
  const rotation = [
    (rotationX * Math.PI) / 180,
    (rotationY * Math.PI) / 180,
    (rotationZ * Math.PI) / 180,
  ];

  const position = [
    centerOffset.x * normalizedScale,
    centerOffset.y * normalizedScale,
    centerOffset.z * normalizedScale,
  ];

  return (
    <group ref={groupRef} rotation={rotation}>
      <primitive
        object={clonedObj}
        position={position}
        scale={[normalizedScale, normalizedScale, normalizedScale]}
      />
    </group>
  );
}
