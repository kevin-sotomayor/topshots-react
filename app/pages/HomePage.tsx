import type { ThreeElements, } from "@react-three/fiber";

import { useState, useEffect, useRef, Suspense} from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader, extend, } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls, useVideoTexture, Plane, useTexture, SoftShadows} from "@react-three/drei";

import "../styles/homepage.css";
import video from "../../assets/video.mp4";
import img from "../../assets/images/amerique_du_sud_temple.jpg";


function VideosShaderMaterial() {
	
}


function VideoMaterial() {
	const texture = useVideoTexture(video, {autoplay: true, start: true, loop: true});
	return (
		<meshBasicMaterial side={THREE.DoubleSide} map={texture} />
	)
}

function VideoElement() {
	return (
		<Canvas className="app-homepage__canvas" camera={{ position: [0, 0, 7.5]}}>
			<Plane args={[16, 9]}>
				<VideoMaterial />
			</Plane>
			<ambientLight color={new THREE.Color(0xff0000)} intensity={2}/>
			<OrbitControls />
			<SoftShadows />
		</Canvas>
	)
}


export function HomePage() {
	return (
		<main className="app-homepage">
			{/* <video src={video} autoPlay={true} loop={true} controls={true}/> */}
			<VideoElement />
		</main>
	)
}