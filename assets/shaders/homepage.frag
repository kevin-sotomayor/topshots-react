uniform vec3 uResolution;
uniform sampler2D uTexture;
uniform float uTime;
varying vec2 vUv;

float warp = 0.5;
float scanlineIntensity = 0.1;

float random(float x) {
    return fract(sin(x) * 43758.5453123);
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

    // Add scanline effect
    float scanline = sin(uv.y * uResolution.y * 3.14159) * scanlineIntensity;
    color *= 1.0 - scanline;

	vec2 cellIndex = floor(uv * 4.0); // Determine the cell index
    if (cellIndex.x == 0.0 && cellIndex.y == 0.0) { // Target cell (1, 2)
        color = vec3(0.5 - color);
    }

    // Add a 3x3 black grid
    float gridThickness = 0.003;
    vec2 gridUv = fract(uv * 4.0);
    if (gridUv.x < gridThickness || gridUv.y < gridThickness || 
        gridUv.x > 1.0 - gridThickness || gridUv.y > 1.0 - gridThickness) {
        color = vec3(0.0); // Black grid lines
    }


    gl_FragColor = vec4(color, 1.0);
}