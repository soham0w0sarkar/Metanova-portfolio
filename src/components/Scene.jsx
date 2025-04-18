import React from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export function Model(props) {
  const group = React.useRef();
  const { nodes, materials, animations } = useGLTF(
    import.meta.env.BASE_URL + "assets/earth/compressed.gltf"
  );
  const { actions } = useAnimations(animations, group);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="root">
            <group name="GLTF_SceneRootNode" rotation={[Math.PI / 2, 0, 0]}>
              <group
                name="Sphere_1"
                rotation={[0, Math.PI / 5, 0]}
                scale={4.499}
              >
                <mesh
                  name="Object_4"
                  geometry={nodes.Object_4.geometry}
                  material={materials["Material.001"]}
                />
              </group>
              <group name="Sphere001_2" scale={4.565}>
                <mesh
                  name="Object_6"
                  geometry={nodes.Object_6.geometry}
                  material={materials["Material.002"]}
                />
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(import.meta.env.BASE_URL + "assets/earth/compressed.gltf");
