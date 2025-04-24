import type { ThreeElements, } from "@react-three/fiber";

import { useMemo, useState, } from "react";
import * as THREE from "three";
import { Canvas, useFrame, } from "@react-three/fiber";
import { OrbitControls, useVideoTexture, Plane, MeshRefractionMaterial, useCursor, Text} from "@react-three/drei";

import "../styles/homepage.css";
import video from "../../assets/video.mp4";
import vertexShader from "../../assets/shaders/homepage.vert";
import fragmentShader from "../../assets/shaders/homepage.frag";
import font from "/home/lalilulelo/Downloads/dm-mono-main/exports/DMMono-Regular.ttf";



// function VideoShaderMaterial() {
// 	const [isHovered, setIsHovered] = useState(0);
// 	const texture = useVideoTexture(video, {autoplay: true, start: true, loop: true});
// 	const material = useMemo(() => {
// 		return new THREE.ShaderMaterial({
// 			uniforms: {
// 				uTexture: { value: texture },
// 				uTime: { value: 0.0 },
// 				uResolution: { value: new THREE.Vector2(1920, 972) },
// 			},
// 			vertexShader: vertexShader,
// 			fragmentShader: fragmentShader,
// 		})
// 	}, [texture])

// 	useFrame(({ clock }) => {
//         if (material) {
//             material.uniforms.uTime.value = clock.getElapsedTime();
//         }
//     });

// 	return (
// 		<>
// 			<Plane args={[16, 9]}>
// 				<primitive attach="material" object={material} side={THREE.DoubleSide}/>
// 			</Plane>
// 		</>
// 	)
// }

function VideoText() {
	const texture = useVideoTexture(video, {autoplay: true, start: true, loop: true});
	return (
		<Text fontSize={1} position={[0, 0, 0]} font={font} fontWeight={900}>
			hello world
			<meshBasicMaterial map={useVideoTexture(video, {autoplay: true, start: true, loop: true})}/> 
			<OrbitControls />
		</Text>
	)
}

function VideoMaterial() {
    return (
        <Canvas className="app-homepage__canvas" camera={{ position: [0, 0, 3] }}>
			{/* <VideoShaderMaterial /> */}
			<VideoText />
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