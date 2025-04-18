import { useState, useEffect, useRef, } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import type { ThreeElements } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";

import "../styles/homepage.css";
import data from "../../data/images.json";
import { cameraPosition } from "three/tsl";



function PhotoElement() {
	const texture = useLoader(THREE.TextureLoader, "/assets/images/amerique_du_sud_temple.jpg");
	const [photoDimensions, setPhotoDimensions] = useState<[number, number]>([0, 0]);
	const [photoPosition, setPhotoPosition] = useState<[number, number, number]>([0, 0, 0]);
	const cameraPosition = 5; // It's the default value

	useEffect(() => {
        const updateDimensions = () => {
			const canvas = document.querySelector(".app-homepage__canvas");
			if (!canvas) return;
			
			const canvasWidth = canvas.clientWidth
            const canvasHeight = canvas.clientHeight;

			const fov = 50;
			const fovInRadians = (fov * Math.PI) / 180;

			const visibleHeight = 2 * Math.tan(fovInRadians / 2) * cameraPosition;

			const aspectRatio = canvasWidth / canvasHeight;
			const visibleWidth = visibleHeight * aspectRatio;

			const photoHeight = visibleHeight / 4;
			const photoWidth = (16 / 9) * photoHeight;
			setPhotoDimensions([photoWidth, photoHeight]);

			const x = -visibleWidth / 2 + photoWidth / 2;
			const y = visibleHeight / 2 - photoHeight / 2;
			setPhotoPosition([x, y, 0]);
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [cameraPosition]);

	return (
		<mesh position={photoPosition} >
			<planeGeometry args={photoDimensions} />
			<meshStandardMaterial map={texture} />
		</mesh>
	);
}

export function HomePage() {
	return (
		<main className="app-homepage">
			<Canvas 
				className="app-homepage__canvas"
				camera={{ fov: 50, near: 0.1, far: 1000, position: [0, 0, 5] }}
			>
				<ambientLight intensity={2} />
				<PhotoElement />
			</Canvas>
		</main>
	)
}