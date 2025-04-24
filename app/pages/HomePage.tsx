import type { ThreeElements, } from "@react-three/fiber";

import { useMemo, } from "react";
import * as THREE from "three";
import { Canvas, useFrame, } from "@react-three/fiber";
import { OrbitControls, useVideoTexture, Plane, } from "@react-three/drei";

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
				uResolution: { value: 1920*972 }, // TODO:
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
		<Plane args={[16, 9]}>
			<primitive attach="material" object={material} />
		</Plane>
	)
}

function VideoMaterial() {
    return (
        <Canvas className="app-homepage__canvas" camera={{ position: [0, 0, 7.5] }} glslVersion={THREE.GLSL3}>
			<VideoShaderMaterial />
            <OrbitControls />
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