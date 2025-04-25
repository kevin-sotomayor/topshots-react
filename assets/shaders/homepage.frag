uniform vec3 uResolution;
uniform sampler2D uTexture;
uniform sampler2D uTextTexture;
uniform float uTime;
varying vec2 vUv;

float warp = 0.5;
float scanlineIntensity = 0.25;


float random(float x) {
    return fract(sin(x) * 43758.5453123);
}

vec2 randomCell(float time, float offset) {
    float frequency = 0.0000005;
    float x = floor(random((time + offset) * frequency) * 4.0);
    float y = floor(random((time + offset + 1.0) * frequency) * 4.0);
    return vec2(x, y);
}

float rand(float n) {
    return fract(sin(n) * 43758.5453123);
}

float noise(float p) {
    float fl = floor(p);
    float fc = fract(p);
    return mix(rand(fl), rand(fl + 1.0), fc);
}

float blockyNoise(vec2 uv, float threshold, float scale, float seed) {
    float scroll = floor(uTime + sin(11.0 * uTime) + sin(uTime)) * 0.77;
    vec2 noiseUV = uv.yy / scale + scroll;
    float noise2 = texture2D(uTexture, noiseUV).r;

    float id = floor(noise2 * 20.0);
    id = noise(id + seed) - 0.5;

    if (abs(id) > threshold)
        id = 0.0;

    return id;
}

vec3 applyGlitchEffect(vec2 uv, vec3 originalColor, float seedOffset) {
    float rgbIntensity = 0.1 + 0.3 * sin((uTime + seedOffset) * 5.0);
    // float displaceIntensity = 0.2 + 0.3 * pow(sin((uTime + seedOffset) * 1.2), 5.0);
	float displaceIntensity = 0.1 * pow(sin((uTime + seedOffset) * 1.2), 5.0);
    float interlaceIntensity = 0.01;
    float dropoutIntensity = 0.1;

    float displace = blockyNoise(uv + vec2(uv.y, 0.0), displaceIntensity, 25.0, 66.6 + seedOffset);
    displace *= blockyNoise(uv.yx + vec2(0.0, uv.x), displaceIntensity, 111.0, 13.7 + seedOffset);

    uv.x += displace;

    vec2 offs = 0.1 * vec2(blockyNoise(uv.xy + vec2(uv.y, 0.0), rgbIntensity, 65.0, 341.0 + seedOffset), 0.0);
	// vec2 offs = 0.001 * vec2(blockyNoise(uv.xy + vec2(uv.y, 0.0), rgbIntensity, 65.0, 341.0 + seedOffset), 0.0); // Réduction du facteur

    float colr = texture2D(uTexture, uv - offs).r;
    float colg = texture2D(uTexture, uv).g;
    float colb = texture2D(uTexture, uv + offs).b;

    vec3 glitchColor = vec3(colr, colg, colb);

    float dropout = blockyNoise(uv, dropoutIntensity, 11.0, uTime + seedOffset) * blockyNoise(uv.yx, dropoutIntensity, 90.0, uTime + seedOffset);
    glitchColor *= (1.0 - 5.0 * dropout);

    return glitchColor;
}

void main() {
    // Normalized pixel coordinates (from 0 to 1) and center them
    vec2 uv = vUv;
    vec2 centeredUv = uv - 0.5;

    // Apply CRT curvature effect
    float curvature = warp * (centeredUv.x * centeredUv.x + centeredUv.y * centeredUv.y);
    centeredUv *= 1.0 + curvature;
    uv = centeredUv + 0.5;

    // Check if UV coordinates are out of bounds
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.01, 0.01, 0.01, 1.0);
        return;
    }

    vec3 color = texture2D(uTexture, uv).rgb;

    // Scanline effect
    float scanline = sin(uv.y * uResolution.y * 3.14159) * scanlineIntensity;
    color *= 1.0 - scanline;

    // Determine the current cell index
    vec2 cellIndex = floor(uv * 3.0);
    vec2 randomCellIndex1 = randomCell(floor(uTime), 0.0);
    vec2 randomCellIndex2 = randomCell(floor(uTime), 10.0);

    // Apply text texture to the top-right cell
    if (cellIndex == vec2(2.0, 0.0)) {
        vec3 textColor = vec3(1.0);
        color = mix(color, textColor, step(0.01, texture2D(uTextTexture, (uv - vec2(2.0 / 3.0, 0.0)) * 3.0).r));
    }

    // Apply glitch effect to random cells
    if (cellIndex == randomCellIndex1) {
        color = applyGlitchEffect(uv, color, 2.0);
    }

    if (cellIndex == randomCellIndex2) {
        color = applyGlitchEffect(uv, color, .0);
    }

    // Grid
    float gridThickness = 0.003;
    vec2 gridUv = fract(uv * 3.0);
    if (gridUv.x < gridThickness || gridUv.y < gridThickness || 
        gridUv.x > 1.0 - gridThickness || gridUv.y > 1.0 - gridThickness) {
        color = vec3(0.0); // Black grid lines
    }

    gl_FragColor = vec4(color , 1.0);
}