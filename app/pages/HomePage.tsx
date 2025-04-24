import type { ThreeElements, } from "@react-three/fiber";

import { useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, } from "@react-three/fiber";
import { OrbitControls, useVideoTexture, Plane, MeshReflectorMaterial, FirstPersonControls} from "@react-three/drei";

import "../styles/homepage.css";
import video from "../../assets/video.mp4";
import vertexShader from "../../assets/shaders/homepage.vert";
import fragmentShader from "../../assets/shaders/homepage.frag";


function createTextTexture(text: string, width: number, height: number): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    if (context) {
        // Dessiner le texte
        context.fillStyle = 'white';
        context.font = '28px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, width / 2, height / 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}


function VideoShaderMaterial() {
	const texture = useVideoTexture(video, {autoplay: true, start: true, loop: true});
	const textTexture = useMemo(() => createTextTexture('DRONE CINEMATOGRAPHY ', 512, 256), []);
	const material = useMemo(() => {
		return new THREE.ShaderMaterial({
			uniforms: {
				uTexture: { value: texture },
				uTextTexture: { value: textTexture },
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
			<primitive attach="material" object={material}/>
		</Plane>
	)
}

function ReflectiveFloor() {
	return (
        <Plane args={[16, 9]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.5, 0]}>
			<MeshReflectorMaterial
				mixBlur={1}
				mixStrength={0.2}
				mixContrast={1}
				resolution={1920}
				mirror={1}
				depthScale={0}
				minDepthThreshold={0.9}
				maxDepthThreshold={1}
				depthToBlurRatioBias={0.25}
				distortion={1}
				reflectorOffset={0}
			/>
        </Plane>
	)
}

function VideoMaterial() {
    return (
        <Canvas className="app-homepage__canvas" camera={{ position: [0, 0, 7] }} gl={{antialias: true}} >
			<VideoShaderMaterial />
			<ReflectiveFloor />
			<ambientLight intensity={0.5} color={new THREE.Color(1, 1, 1)}/>
			<FirstPersonControls 
				movementSpeed={0} 
				lookSpeed={0.005}
				constrainVertical={true}
				verticalMax={Math.PI / 2 - 0.05}
				verticalMin={Math.PI / 2}
				lookAt={0}
			/>
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