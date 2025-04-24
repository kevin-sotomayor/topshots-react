import type { ThreeElements, } from "@react-three/fiber";

import { useMemo, useState, } from "react";
import * as THREE from "three";
import { Canvas, useFrame, } from "@react-three/fiber";
import { OrbitControls, useVideoTexture, Plane, MeshReflectorMaterial, useCursor, Text, Text3D, Center} from "@react-three/drei";

import "../styles/homepage.css";
import video from "../../assets/video.mp4";
import vertexShader from "../../assets/shaders/homepage.vert";
import fragmentShader from "../../assets/shaders/homepage.frag";



function VideoShaderMaterial() {
	const texture = useVideoTexture(video, {autoplay: true, start: true, loop: true});
	const material = useMemo(() => {
		return new THREE.ShaderMaterial({
			uniforms: {
				uTexture: { value: texture },
				uTime: { value: 0.0 },
				uResolution: { value: new THREE.Vector2(1920, 972) },
			},
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
		})
	}, [texture])

	useFrame(({ clock }) => {
        if (material) {
            material.uniforms.uTime.value = clock.getElapsedTime();
        }
    });

	return (
		<Plane args={[16, 9]} position={[0, 0, 0]}>
			<primitive attach="material" object={material} side={THREE.DoubleSide}/>
		</Plane>
	)
}

function ReflectiveFloor() {
	return (
        <Plane args={[16, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.5, 0]}>
			<MeshReflectorMaterial
				blur={[0, 0]} // Blur ground reflections (width, height), 0 skips blur
				mixBlur={1} // How much blur mixes with surface roughness (default = 1)
				mixStrength={1} // Strength of the reflections
				mixContrast={1} // Contrast of the reflections
				resolution={1920} // Off-buffer resolution, lower=faster, higher=better quality, slower
				mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors
				depthScale={0} // Scale the depth factor (0 = no depth, default = 0)
				minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
				maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
				depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
				distortion={1} // Amount of distortion based on the distortionMap texture // The red channel of this texture is used as the distortion map. Default is null
				reflectorOffset={0} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
			/>
        </Plane>
	)
}

function VideoMaterial() {
    return (
        <Canvas className="app-homepage__canvas" camera={{ position: [0, 0, 6] }}>
			<VideoShaderMaterial />
			<ReflectiveFloor />
			<OrbitControls />
			<ambientLight color={new THREE.Color(0, 0, 0)} intensity={1}/>
        </Canvas>
    );
}

export function HomePage() {
	return (
		<main className="app-homepage">
			<VideoMaterial />
		</main>
	)
}