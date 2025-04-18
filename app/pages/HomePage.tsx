import { useState, useEffect, useRef, } from "react";
import * as THREE from "three";
import { Canvas, useFrame, } from "@react-three/fiber";
import type { ThreeElements } from "@react-three/fiber";

import "../styles/homepage.css";
import data from "../../data/images.json";


export function HomePage() {
	function Box(props: ThreeElements['mesh']) {
		const meshRef = useRef<THREE.Mesh>(null!)
		const [hovered, setHover] = useState(false)
		const [active, setActive] = useState(false)
		useFrame((state, delta) => (meshRef.current.rotation.x += delta))
		return (
			<mesh
				{...props}
				ref={meshRef}
				scale={active ? 1.5 : 1}
				onClick={(event) => setActive(!active)}
				onPointerOver={(event) => setHover(true)}
				onPointerOut={(event) => setHover(false)}>
				<boxGeometry args={[1, 1, 1]} />
				<meshStandardMaterial color={hovered ? 'hotpink' : '#2f74c0'} />
			</mesh>
		)
	}

	return (
		<main className="app-homepage">
			<Canvas>
				<ambientLight intensity={Math.PI / 2} />
				<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
				<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
				<Box position={[-1.2, 0, 0]} />
				<Box position={[1.2, 0, 0]} />
			</Canvas>,
			{/* {
				photos && (
					photos.map((image, index) => (
						<img className="app-homepage__image" key={index} src={image.img_url} />
					))
				)
			} */}
		</main>
	)
}