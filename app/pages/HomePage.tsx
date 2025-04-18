import { useState, useEffect, useRef, } from "react";
import * as THREE from "three";
import { Canvas, useFrame, } from "@react-three/fiber";
import type { ThreeElements } from "@react-three/fiber";

import "../styles/homepage.css";
import data from "../../data/images.json";


function RotatingCube() {
	const meshRef = useRef<THREE.Mesh>(null);
	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.rotation.x += 0.01;
			meshRef.current.rotation.y += 0.01;
		}
	});
	return (
		<mesh ref={meshRef}>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color="blue" />
		</mesh>
	);
}

export function HomePage() {
	return (
		<main className="app-homepage">
			<Canvas>
				<ambientLight intensity={0.5} />
				<pointLight position={[10, 10, 10]} />
				<RotatingCube />
			</Canvas>
		</main>
	)
}