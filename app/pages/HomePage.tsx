import * as THREE from "three";
import { useState, useEffect, } from "react";
import "../styles/homepage.css";
import data from "../../data/images.json";
import { color } from "three/tsl";


export function HomePage() {
	useEffect(() => {
		const appMain = document.querySelector(".app-homepage");
		if (appMain) {
			const scene = new THREE.Scene();
			scene.background = new THREE.Color("#FFFFFF");
			const camera = new THREE.PerspectiveCamera(50, appMain.clientWidth / appMain.clientHeight, 0.1, 1000);
			const renderer = new THREE.WebGLRenderer();
			renderer.setSize(appMain.clientWidth, appMain.clientHeight);
			appMain.appendChild(renderer.domElement);
			camera.position.z = 25;
			const textureLoader = new THREE.TextureLoader();

			// const meshArray = [];
			// for (let i = 0; i < data.images.length; i++) {
				
			// }


			const texture = textureLoader.load("/assets/images/amerique_du_sud_temple.jpg")

			const planeMesh = new THREE.Mesh(
				new THREE.PlaneGeometry(16, 9),
				new THREE.MeshBasicMaterial({ map: texture })
			);

			// planeMesh.position.x = appMain.clientWidth;
			// planeMesh.position.y = appMain.clientHeight;

			console.log(appMain.clientWidth / 25);

			planeMesh.position.x = -25.1;
			planeMesh.position.y = 7.1;

			scene.add(planeMesh);


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

	// console.log(posters);
	return (
		<main className="app-homepage">
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