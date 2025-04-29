import type { ThreeElements, } from "@react-three/fiber";

import { useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, extend, } from "@react-three/fiber";
import { useVideoTexture, Plane, MeshReflectorMaterial, FirstPersonControls, OrbitControls, Sphere, SpotLight, shaderMaterial} from "@react-three/drei";

import "../styles/homepage.css";
import videoSrc from "../../assets/video.mp4";
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
        context.font = '24px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, width / 2, height / 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

function CustomPlane({ args, position, children }: { args: number[]; position: number[]; children?: React.ReactNode }) {
    const geometry = useMemo(() => {

		// const customGeometry = new THREE.BufferGeometry();
		// const positions = [];
		// const normals = [];
		// const uvs = [];
		// const vertices = [
		// 	{ pos: [-8, -4.5,  0], norm: [ 0,  0,  1], uv: [0, 0], },
		// 	{ pos: [ 8, -4.5,  0], norm: [ 0,  0,  1], uv: [1, 0], },
		// 	{ pos: [-8,  4.5,  0], norm: [ 0,  0,  1], uv: [0, 1], },

		// 	{ pos: [-8,  4.5,  0], norm: [ 0,  0,  1], uv: [0, 1], },
		// 	{ pos: [ 8, -4.5,  0], norm: [ 0,  0,  1], uv: [1, 0], },
		// 	{ pos: [ 8,  4.5,  0], norm: [ 0,  0,  1], uv: [1, 1], },
		// ];
		// for (const vertex of vertices) {
		// 	positions.push(...vertex.pos);
		// 	normals.push(...vertex.norm);
		// 	uvs.push(...vertex.uv);
		// }

		// customGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
		// customGeometry.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(normals), 3));
		// customGeometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));

		// return customGeometry;

	}, []);



    return (
        <mesh geometry={geometry}>
            {children}
        </mesh>
    );
}


function VideoShaderMaterial() {
	const texture = useVideoTexture(videoSrc, {autoplay: true, start: true, loop: true});
	const textTexture = useMemo(() => createTextTexture('DRONE CINEMATOGRAPHY ', 512, 256), []);
	const shader = useMemo(() => {
		return new THREE.ShaderMaterial({
			uniforms: {
				uTexture: { value: texture },
				uTextTexture: { value: textTexture },
				uTime: { value: 0.0 },
				uResolution: { value: new THREE.Vector2(1920, 972) },
			},
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			transparent: true,
			blending: THREE.NormalBlending,
		})
	}, [texture])

	useFrame(({ clock }) => {
        if (shader) {
            shader.uniforms.uTime.value = clock.getElapsedTime();
			// add the resolution handler to the memo
        }
    });

	return (
		<CustomPlane args={[16, 9]} position={[0, 0, 2.5]} >
			<primitive object={shader} attach="material" />
		</CustomPlane>
	)
}

function LeftWall() {
	return (
		<Plane args={[50, 9]} position={[-8, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
			<meshStandardMaterial color={new THREE.Color(0, 0, 1)}/>
		</Plane>
	)
}

function RightWall() {
	return (
		<Plane args={[50, 9]} position={[8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} setRotationFromAxisAngle={Math.PI / 2}>
			<meshStandardMaterial color={new THREE.Color(0, 0, 1)}/>
		</Plane>
	)
}

function RoofTexture() {
	return (
		<Plane args={[16, 50]} position={[0, +4.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
			<meshStandardMaterial color={new THREE.Color(1.0, 0.0, 0.0)}/>
		</Plane>
	)
}

function FloorTexture() {
	return (
		<Plane args={[16, 50]} position={[0, -4.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
			<meshStandardMaterial color={new THREE.Color(1.0, 0.0, 0.0)}/>
		</Plane>
	)
}

function VideoMaterial() {
    return (
        <Canvas className="app-homepage__canvas" camera={{ position: [0, 0, 6.5] }} gl={{ antialias: true, alpha: true, }} >
			<VideoShaderMaterial />
			<RoofTexture />
			<RightWall />
			<FloorTexture />
			<LeftWall />
			<ambientLight intensity={1.0} color={new THREE.Color(1, 1, 1)}/>
			{/* <FirstPersonControls activeLook={false}/> */}
			<OrbitControls />
		</Canvas>
    )
}

export function HomePage() {
	return (
		<main className="app-homepage">
			<VideoMaterial />
		</main>
	)
}
