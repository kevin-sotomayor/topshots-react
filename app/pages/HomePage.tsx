import type { ThreeElements, } from "@react-three/fiber";

import { useMemo, } from "react";
import * as THREE from "three";
import { Canvas, useFrame, } from "@react-three/fiber";
import { OrbitControls, useVideoTexture, Plane, } from "@react-three/drei";

import "../styles/homepage.css";
import video from "../../assets/video.mp4";


function VideoShaderMaterial() {
	const texture = useVideoTexture(video, {autoplay: true, start: true, loop: true});
	const material = useMemo(() => {
		return new THREE.ShaderMaterial({
			uniforms: {
				uTexture: { value: texture },
				uTime: { value: 0.0 },
			},
			vertexShader: `
				varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
			`,
			fragmentShader: `
				uniform sampler2D uTexture;
				uniform float uTime;
				varying vec2 vUv;

				void main() {
					vec2 uv = vUv;
					uv.x += sin(uv.y * 10.0 + uTime) * 0.05; // Exemple d'effet ondulé
					gl_FragColor = texture2D(uTexture, uv);
				}
			`,
			
		})
	}, [texture])

	useFrame(({ clock }) => {
        if (material) {
            material.uniforms.uTime.value = clock.getElapsedTime();
        }
    });

	return (
		<Plane args={[16, 9]}>
			<primitive attach="material" object={material} />
		</Plane>
	)
}

function VideoMaterial() {
    return (
        <Canvas className="app-homepage__canvas" camera={{ position: [0, 0, 7.5] }}>
			<VideoShaderMaterial />
            <OrbitControls />
        </Canvas>
    );
}

export function HomePage() {
	return (
		<main className="app-homepage">
			<VideoMaterial />
		</main>
	)
}