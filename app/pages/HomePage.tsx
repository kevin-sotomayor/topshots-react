import { useState, useEffect, useRef, } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import type { ThreeElements } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";

import "../styles/homepage.css";
import data from "../../data/images.json";


function Scene({}) {
	const texture = useLoader(THREE.TextureLoader, "/assets/images/amerique_du_sud_temple.jpg");
	return (
		<>
			<ambientLight intensity={1.5} color={"white"}/>
			<mesh>
				<planeGeometry args={[16, 9]}/>
				<meshStandardMaterial map={texture} />
			</mesh>
		</>
	)
}

export function HomePage() {
	return (
		<main className="app-homepage">
			<Canvas>
				<Scene />
				{/* <OrbitControls /> */}
			</Canvas>
		</main>
	)
}