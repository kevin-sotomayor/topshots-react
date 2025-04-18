import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useState, useEffect, } from "react";
import "../styles/homepage.css";
import data from "../../data/images.json";
import { color } from "three/tsl";


export function HomePage() {
	useEffect(() => {
		const appMain = document.querySelector(".app-homepage");
		if (appMain) {
			// const scene = new THREE.Scene();
			// scene.background = new THREE.Color("#FFFFFF");
			// const camera = new THREE.PerspectiveCamera(50, appMain.clientWidth / appMain.clientHeight, 0.1, 1000);
			// const renderer = new THREE.WebGLRenderer();
			// renderer.setSize(appMain.clientWidth, appMain.clientHeight);
			// appMain.appendChild(renderer.domElement);
			// camera.position.z = 25;
			// const textureLoader = new THREE.TextureLoader();

			// // const meshArray = [];
			// // for (let i = 0; i < data.images.length; i++) {
				
			// // }


			// const texture = textureLoader.load("/assets/images/amerique_du_sud_temple.jpg")

			// const planeMesh = new THREE.Mesh(
			// 	new THREE.PlaneGeometry(46, 24),
			// 	new THREE.MeshBasicMaterial({ map: texture })
			// );

			// planeMesh.position.x = appMain.clientWidth;
			// planeMesh.position.y = appMain.clientHeight;

			// console.log(appMain.clientWidth / 25);

			// planeMesh.position.x = 0;
			// planeMesh.position.y = 0;
			// scene.add(planeMesh);


			// const animate = () => {
			// 	requestAnimationFrame(animate);
			// 	renderer.render(scene, camera);
			// };
			// animate();

			// return () => {
			// 	renderer.dispose();
			// 	appMain.removeChild(renderer.domElement);
			// };

			const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera(50, appMain.clientWidth / appMain.clientHeight, 0.1, 1000);
			const textureLoader = new THREE.TextureLoader();
	
			camera.position.set(0, 0, 1);
			camera.lookAt(0, 0, 0);
			camera.aspect = appMain.clientWidth / appMain.clientHeight;
	
			const axesHelper = new THREE.AxesHelper(100);
			scene.add(axesHelper);
	
			const renderer = new THREE.WebGLRenderer({
				antialias: true,
			});
	
			scene.background = new THREE.Color().setRGB(1., 1., 1.);
	
			renderer.setSize(appMain.clientWidth, appMain.clientHeight);
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setAnimationLoop(renderLoop);
	
			const canvas = renderer.domElement;
			appMain.appendChild(canvas);
	
			camera.position.z = 5;
	
			// const controls = new OrbitControls(camera, canvas);
			// controls.enableDamping = false;
			// controls.autoRotate = false;

			const meshArray = [];
			for (let i = 0; i < data.images.length; i++) {

			}

	
			window.addEventListener("resize", () => {
				camera.aspect = appMain.clientWidth / appMain.clientHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(appMain.clientWidth, appMain.clientHeight);
				renderer.setPixelRatio(window.devicePixelRatio);
			});
	
			function renderLoop() {
				// controls.update();
				renderer.render(scene, camera);
				window.requestAnimationFrame(renderLoop);
				camera.updateProjectionMatrix();
			}

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