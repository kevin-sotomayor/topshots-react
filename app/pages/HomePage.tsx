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
	const texture2 = useLoader(THREE.TextureLoader, "/assets/images/athene_temple.jpg");
	const [photoDimensions, setPhotoDimensions] = useState<[number, number]>([0, 0]);
	const [firstRowPosition, setfirstRowPosition] = useState<[number, number, number]>([0, 0, 0]);
	const [photoPosition2, setPhotoPosition2] = useState<[number, number, number]>([0, 0, 0]);
	const [firstRowOfPhotos, setFirstRowOfPhotos] = useState<number[][]>([]);
	const cameraPosition = 5; // It is the default value

	useEffect(() => {
        const updateDimensions = () => {
			const canvas = document.querySelector(".app-homepage__canvas");
			if (!canvas) return;
			
			const canvasWidth = canvas.clientWidth;
            const canvasHeight = canvas.clientHeight;

			const fov = 50;
			const fovInRadians = (fov * Math.PI) / 180;

			const visibleHeight = 2 * Math.tan(fovInRadians / 2) * cameraPosition;

			const aspectRatio = canvasWidth / canvasHeight;
			const visibleWidth = visibleHeight * aspectRatio;

			const photoHeight = visibleHeight / 4;
			const photoWidth = (16 / 9) * photoHeight;
			setPhotoDimensions([photoWidth, photoHeight]);

			const firstRowX = -visibleWidth / 2 + photoWidth / 2;
			const firstRowY = visibleHeight / 2 - photoHeight / 2;
			setfirstRowPosition([firstRowX, firstRowY, 0]);
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [cameraPosition]);

	return (
		<group position={new THREE.Vector3(firstRowPosition[0], firstRowPosition[1], 0)}>
			<mesh>
				<planeGeometry args={photoDimensions} />
				<meshStandardMaterial map={texture} />
			</mesh>
		</group>
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