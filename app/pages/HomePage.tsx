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
	const [vertexShader, setVertexShader] = useState<string>("");
	const [fragmentShader, setFragmentShader] = useState<string>("");
	const [hover, setHover] = useState(0);
	const materialRef = useRef<THREE.ShaderMaterial>(null);

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

			// const firstRowX = -visibleWidth / 2 + photoWidth / 2;
			const firstRowY = visibleHeight / 2 - photoHeight / 2;
			setfirstRowPosition(firstRowY);
        };

		const vertexShader = `
  			varying vec2 vUv;

  			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  			}
		`;

		const fragmentShader = `
			varying vec2 vUv;
			uniform sampler2D uTexture;
			uniform float uHover;

			void main() {
				vec4 textureColor = texture2D(uTexture, vUv); // Récupère la couleur de la texture
				vec3 alteredColor = mix(textureColor.rgb, textureColor.rgb * vec3(1.2, 0.9, 0.9), uHover); // Applique l'effet si uHover > 0
				gl_FragColor = vec4(alteredColor, textureColor.a); // Applique la couleur altérée avec l'alpha d'origine
			}
		`;


		setVertexShader(vertexShader);
		setFragmentShader(fragmentShader);


        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [cameraPosition]);

	useEffect(() => {
        if (materialRef.current) {
            materialRef.current.uniforms.uHover.value = hover;
        }
    }, [hover]);

	return (
		<group position={[0, firstRowPosition, 0]}>
			{photosData && photosData.map((imageUrl, index) => {
				const texture = loadTexture(imageUrl);

				return (
					<mesh 
						key={index} 
						position={[-canvasFov[0] / 2 + photoDimensions[0] / 2 + photoDimensions[0] * index, 0,0]} 
						onPointerOver={() => setHover(1)}
						onPointerOut={() => setHover(0)}
					>
						<planeGeometry args={photoDimensions} />
						<shaderMaterial
							ref = {materialRef}
							vertexShader={vertexShader} 
							fragmentShader={fragmentShader} 
							uniforms={{ 
								uTexture: { value: texture }, 
								uHover: { value: hover },
							}}
							transparent = {true}
						/>
					</mesh>
				)
			})}
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