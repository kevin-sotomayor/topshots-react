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

function TvShape({ args, position, children }: { args: number[]; position: number[]; children?: React.ReactNode }) {
    const geometry = useMemo(() => {
		const x = 0, y = 0;
		const tvShape = new THREE.Shape();

		tvShape.moveTo(x - 8, y - 4.5);
		tvShape.bezierCurveTo(
			x - 8, y - 4.5,
			x - 0, y - 6,
			x + 8, y - 4.5,
		);
		tvShape.bezierCurveTo(
			x + 8, y - 4.5,
			x + 9.5, y + 0,
			x + 8, y + 4.5,
		);
		tvShape.bezierCurveTo(
			x + 8, y + 4.5,
			x - 0, y + 6,
			x - 8, y + 4.5,
		);
		tvShape.bezierCurveTo(
			x - 8, y + 4.5,
			x - 9.5, y - 0,
			x - 8, y - 4.5,
		);
		tvShape.lineTo(x - 8, y - 4.5);

		const geometry = new THREE.ShapeGeometry(tvShape);
		geometry.computeBoundingBox();
		const { min, max } = geometry.boundingBox!;
		const uvAttribute = new Float32Array(geometry.attributes.position.count * 2);

		for (let i = 0; i < geometry.attributes.position.count; i++) {
            const x = geometry.attributes.position.getX(i);
            const y = geometry.attributes.position.getY(i);

            uvAttribute[i * 2] = (x - min.x) / (max.x - min.x); // U
            uvAttribute[i * 2 + 1] = (y - min.y) / (max.y - min.y); // V
        }

		geometry.setAttribute('uv', new THREE.BufferAttribute(uvAttribute, 2));

		return geometry;
	}, []);

    return (
        <mesh geometry={geometry} position={position}>
            {children}
        </mesh>
    );
}


function ShaderMaterial() {
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
		<TvShape args={[16, 9]} position={[0, 0, 0]} >
			<primitive object={shader} attach="material" />
		</TvShape>
	)
}

function LeftWall() {
	return (
		<Plane args={[64, 14]} position={[-12, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
			<meshStandardMaterial color={new THREE.Color(0.25, 0.25, 0.25)}/>
		</Plane>
	)
}

function RightWall() {
	return (
		<Plane args={[64, 14]} position={[12, 0, 0]} rotation={[0, -Math.PI / 2, 0]} setRotationFromAxisAngle={Math.PI / 2}>
			<meshStandardMaterial color={new THREE.Color(0.25, 0.25, 0.25)}/>
		</Plane>
	)
}

function RoofTexture() {
	return (
		<Plane args={[24, 64]} position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]}>
			<meshStandardMaterial color={new THREE.Color(0.1, 0.1, 0.1)}/>
		</Plane>
	)
}

function FloorTexture() {
	return (
		<Plane args={[24, 64]} position={[0, -6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
			<meshStandardMaterial color={new THREE.Color(0.1, 0.1, 0.1)}/>
		</Plane>
	)
}

function VideoMaterial() {
    return (
        <Canvas className="app-homepage__canvas" camera={{ position: [0, 0, 8] }} gl={{ antialias: true, alpha: true, }} >
			<ShaderMaterial />
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
