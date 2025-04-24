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

const float glitchAmplitude = 0.0; // increase this
const float glitchNarrowness = 4.0;
const float glitchBlockiness = 2.0;
const float glitchMinimizer = 0.0; // decrease this

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 uv = fragCoord / uResolution.xy;
	float aspect = uResolution.x / uResolution.y;
	vec2 a = vec2(uv.x * aspect, uv.y * aspect);
	vec2 uv2 = vec2(a.x / uResolution.x, exp(a.y));

	float shift = glitchAmplitude * pow(fbm(uv2, 4, glitchBlockiness, glitchNarrowness), glitchMinimizer);

	// float colR = texture(uTexture, vec2(uv.x + shift, uv.y)).r * (1. - shift);
	// float colG = texture(uTexture, vec2(uv.x - shift, uv.y)).g * (1. - shift);
	// float colB = texture(uTexture, vec2(uv.x - shift, uv.y)).b * (1. - shift);

	float colR = texture(uTexture, uv).r;
	float colG = texture(uTexture, uv).g;
	float colB = texture(uTexture, uv).b;

	vec3 f = vec3(colR, colG, colB);

	fragColor = vec4(f, 1.);
}

void main() {
	vec4 fragColor;
	mainImage(fragColor, gl_FragCoord.xy);
	gl_FragColor = fragColor;
}
