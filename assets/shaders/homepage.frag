uniform vec3 uResolution;
uniform sampler2D uTexture;
uniform float uTime;
varying vec2 vUv;

float warp = 0.5;
float scanlineIntensity = 0.1;

float random(float x) {
    return fract(sin(x) * 43758.5453123);
}

vec2 randomCell(float time, float offset) {
    float frequency = 0.0000005;
    float x = floor(random((time + offset) * frequency) * 3.0);
    float y = floor(random((time + offset + 1.0) * frequency) * 3.0);
    return vec2(x, y);
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
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
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

    if (cellIndex == randomCellIndex1 || cellIndex == randomCellIndex2) {
        color = vec3(1.0) - color;
    }

	// Grid
    float gridThickness = 0.003;
    vec2 gridUv = fract(uv * 3.0);
    if (gridUv.x < gridThickness || gridUv.y < gridThickness || 
        gridUv.x > 1.0 - gridThickness || gridUv.y > 1.0 - gridThickness) {
        color = vec3(0.0); // Black grid lines
    }

    gl_FragColor = vec4(color, 1.0);
}