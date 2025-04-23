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
				uResolution: { value: 1920*972 },
			},
			vertexShader: `
				varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
			`,
			fragmentShader: `
				uniform vec3 uResolution;
				uniform sampler2D uTexture;
				uniform float uTime;
				varying vec2 vUv;

				float random(vec2 p) {
					float t = floor(uTime * 20.) / 10.;
					return fract(sin(dot(p, vec2(t * 12.9898, t * 78.233))) * 43758.5453);
				}

				float noise(vec2 uv, float blockiness) {   
					vec2 lv = fract(uv);
					vec2 id = floor(uv);
					
					float n1 = random(id);
					float n2 = random(id+vec2(1,0));
					float n3 = random(id+vec2(0,1));
					float n4 = random(id+vec2(1,1));
					
					vec2 u = smoothstep(0.0, 1.0 + blockiness, lv);

					return mix(mix(n1, n2, u.x), mix(n3, n4, u.x), u.y);
				}

				float fbm(vec2 uv, int count, float blockiness, float complexity) {
					float val = 0.0;
					float amp = 0.5;
						
					while(count != 0) {
						val += amp * noise(uv, blockiness);
						amp *= 0.5;
						uv *= complexity;    
						count--;
					}
						
					return val;
				}

				const float glitchAmplitude = 0.2; // increase this
				const float glitchNarrowness = 4.0;
				const float glitchBlockiness = 2.0;
				const float glitchMinimizer = 8.0; // decrease this

				void mainImage(out vec4 fragColor, in vec2 fragCoord) {
					vec2 uv = fragCoord/uResolution.xy;
					float aspect = uResolution.x / uResolution.y;
					vec2 a = vec2(uv.x * aspect , uv.y);
					vec2 uv2 = vec2(a.x / uResolution.x, exp(a.y));

					float shift = glitchAmplitude * pow(fbm(uv2, 4, glitchBlockiness, glitchNarrowness), glitchMinimizer);
					
					float colR = texture(uTexture, vec2(uv.x + shift, uv.y)).r * (1. - shift);
					float colG = texture(uTexture, vec2(uv.x - shift, uv.y)).g * (1. - shift);
					float colB = texture(uTexture, vec2(uv.x - shift, uv.y)).b * (1. - shift);
					
					vec3 f = vec3(colR, colG, colB);
					
					fragColor = vec4(f, 1.);
				}

				void main() {
					mainImage(gl_FragCoord.xy);
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