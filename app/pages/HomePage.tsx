import { useState, useEffect, useRef, } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import type { ThreeElements } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";

import "../styles/homepage.css";
import data from "../../data/images.json";


function PhotoElement() {
	const [photosData, setPhotosData] = useState<[] | string[]>([]);
	const [photoDimensions, setPhotoDimensions] = useState<[number, number]>([0, 0]);
	// const [firstRowPosition, setfirstRowPosition] = useState<[number, number, number]>([0, 0, 0]);
	const [canvasFov, setCanvasFov] = useState<number[]>([0, 0]);
	const [firstRowPosition, setfirstRowPosition] = useState<| number>(0);
	const groupRef = useRef<THREE.Group>(null);

	const cameraPosition = 5; // It is the default value

	function loadTexture(url: string) {
		const texture = useLoader(THREE.TextureLoader, url);
		return texture;
	}

	// const [photoPosition2, setPhotoPosition2] = useState<[number, number, number]>([0, 0, 0]);
	// const [firstRowOfPhotos, setFirstRowOfPhotos] = useState<number[][]>([]);

	useEffect(() => {
		if (!data) return;
		setPhotosData(data);

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
			setCanvasFov([visibleWidth, visibleHeight]);
			console.log("canvas fov : ", canvasFov);

			const photoHeight = visibleHeight / 4;
			const photoWidth = (16 / 9) * photoHeight;
			setPhotoDimensions([photoWidth, photoHeight]);

			console.log("photo dimesions : ", photoDimensions);

			const firstRowX = -visibleWidth / 2 + photoWidth / 2;
			const firstRowY = visibleHeight / 2 - photoHeight / 2;
			setfirstRowPosition(firstRowY);
        };



        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [cameraPosition]);

	// useFrame(() => {
	// 	if (groupRef.current) {
	// 		groupRef.current.position.x -= 0.001;
	// 		if (groupRef.current.position.x < -50) {
	// 			groupRef.current.position.x = 100;
	// 		}
	// 	}
	// });

	return (
		// <group position={new THREE.Vector3(firstRowPosition[0], firstRowPosition[1], 0)}>
		<group ref={groupRef} position={[0, firstRowPosition, 0]} >
			{
				photosData && photosData.map((imageUrl, index) => (
      				<mesh key={index} position={new THREE.Vector3((-canvasFov[0] / 2 + photoDimensions[0] / 2 + photoDimensions[0] * index), 0, 0)}>
        				<planeGeometry args={photoDimensions} />
        				<meshStandardMaterial map={loadTexture(imageUrl)} />
      				</mesh>
    			))
			}
		</group>
	)
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