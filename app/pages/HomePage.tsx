import * as THREE from "three";
import { useEffect } from "react";
import "../styles/homepage.css";
import posters from "../../data/projects.json";


export function HomePage() {
	useEffect(() => {
		const appMain = document.querySelector(".app-homepage");
		if (appMain) {
			const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera(50, appMain.clientWidth / appMain.clientHeight, 0.1, 1000);
			const renderer = new THREE.WebGLRenderer();
			renderer.setSize(appMain.clientWidth, appMain.clientHeight);
			appMain.appendChild(renderer.domElement);

			const planeMesh = new THREE.Mesh(
				new THREE.PlaneGeometry(2, 2),
				new THREE.MeshBasicMaterial({ color: 0xff0000 })
			);
			scene.add(planeMesh);

			camera.position.z = 5;

			const animate = () => {
				requestAnimationFrame(animate);
				renderer.render(scene, camera);
			};
			animate();

			return () => {
				renderer.dispose();
				appMain.removeChild(renderer.domElement);
			};
		}
	}, []);

	console.log(posters);

	return (
		<main className="app-homepage">
			
		</main>
	)
}