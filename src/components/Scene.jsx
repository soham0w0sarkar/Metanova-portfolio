import React from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export function Model(props) {
  const group = React.useRef();
  const { nodes, materials, animations } = useGLTF(
    import.meta.env.BASE_URL + "assets/earth/scene.gltf"
  );
  const { actions } = useAnimations(animations, group);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group
            name="3f0d8c1a7c7c45138e5b99b56838fcb9fbx"
            rotation={[Math.PI / 2, 0, 0]}
          >
            <group name="Object_2">
              <group name="RootNode">
                <group name="Earth" rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh
                    name="Earth_Material_#50_0"
                    geometry={nodes["Earth_Material_#50_0"].geometry}
                    material={materials.Material_50}
                  />
                </group>
                <group
                  name="EarthClouds"
                  rotation={[-Math.PI / 2, -Math.PI / 9, 0]}
                  scale={1.01}
                >
                  <mesh
                    name="EarthClouds_Material_#62_0"
                    geometry={nodes["EarthClouds_Material_#62_0"].geometry}
                    material={materials.Material_62}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(import.meta.env.BASE_URL + "assets/earth/scene.gltf");
