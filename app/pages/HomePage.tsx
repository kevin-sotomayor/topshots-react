import * as THREE from "three";
import { useEffect } from "react";
import "../styles/homepage.css";


export function HomePage() {
	useEffect(() => {
		const appMain = document.querySelector(".app-homepage");
		if (appMain) {
			const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
			
			const renderer = new THREE.WebGLRenderer();
			renderer.setSize(appMain.clientWidth, appMain.clientHeight);
			renderer.setAnimationLoop( animate );
			appMain?.appendChild( renderer.domElement );
			
			const geometry = new THREE.BoxGeometry( 1, 1, 1 );
			const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
			const cube = new THREE.Mesh( geometry, material );
			scene.add( cube );
			
			camera.position.z = 5;
			
			function animate() {
			
			  cube.rotation.x += 0.01;
			  cube.rotation.y += 0.01;
			
			  renderer.render( scene, camera );
			
			}
		}
	}, []);

	return (
		<main className="app-homepage">
			
		</main>
	)
}