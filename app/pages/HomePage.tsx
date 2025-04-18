import { useState, useEffect, useRef, } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import type { ThreeElements } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";

import "../styles/homepage.css";
import data from "../../data/images.json";



function PhotoElement() {
	const texture = useLoader(THREE.TextureLoader, "/assets/images/amerique_du_sud_temple.jpg");
	const [photoDimensions, setPhotoDimensions] = useState<[number, number]>([0, 0]);

	useEffect(() => {
		const canvas = document.querySelector(".app-homepage__canvas");
        const updateDimensions = () => {
			const canvasWidth = canvas!.clientWidth
            const canvasHeight = canvas!.clientHeight;
            const photoHeight = canvasHeight / 4;
			const photoWidth = (16 / 9) * photoHeight;
            setPhotoDimensions([photoWidth, photoHeight]);
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

	return (
		<mesh position={new THREE.Vector3(0, 0, 0)}>
			<planeGeometry args={[16, 9]} />
			<meshStandardMaterial map={texture} />
		</mesh>
	);
}

export function HomePage() {
	return (
		<main className="app-homepage">
			<Canvas camera={ {fov: 50, near: 0.1, far: 1000, position: [0, 0, 25]} } className="app-homepage__canvas">
				<ambientLight intensity={1.5} />
				<PhotoElement />
			</Canvas>
		</main>
	)
}