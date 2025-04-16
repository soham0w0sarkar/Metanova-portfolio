import React, { useRef, useEffect } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Earth(props) {
  const earthRef = useRef();

  const { nodes, materials } = useGLTF("/assets/earth/scene.gltf");

  const textures = useTexture({
    map: "/assets/earth/textures/Material_50_baseColor.jpeg",
    emissiveMap: "/assets/earth/textures/Material_50_emissive.jpeg",
    metalnessRoughnessMap:
      "/assets/earth/textures/Material_50_metallicRoughness.png",
    normalMap: "/assets/earth/textures/Material_50_normal.png",
    cloudMap: "/assets/earth/textures/Material_62_baseColor.png",
    cloudEmissive: "/assets/earth/textures/Material_62_emissive.jpeg",
  });

  useEffect(() => {
    [
      textures.map,
      textures.normalMap,
      textures.metalnessRoughnessMap,
      textures.emissiveMap,
      textures.cloudMap,
      textures.cloudEmissive,
    ].forEach((texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    });
  }, [textures]);

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={earthRef}
        geometry={nodes["Earth_Material_#50_0"]?.geometry}
        scale={0.5}
      >
        <meshStandardMaterial
          map={textures.map}
          normalMap={textures.normalMap}
          emissive={new THREE.Color(0x444444)}
          emissiveMap={textures.emissiveMap}
          emissiveIntensity={0.5}
          metalness={0.5}
          roughness={0.5}
          metalnessMap={textures.metalnessRoughnessMap}
          roughnessMap={textures.metalnessRoughnessMap}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh
        geometry={
          nodes["EarthClouds_Material_#62_0"]?.geometry ||
          nodes.EarthMesh?.geometry
        } // Use the same geometry or a dedicated cloud mesh
        scale={0.505} // Slightly larger than the Earth sphere
      >
        <meshStandardMaterial
          map={textures.cloudMap}
          emissiveMap={textures.cloudEmissive}
          emissive={new THREE.Color(0xffffff)}
          emissiveIntensity={0.2}
          transparent={true}
          opacity={0.8}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/assets/earth/scene.gltf");
