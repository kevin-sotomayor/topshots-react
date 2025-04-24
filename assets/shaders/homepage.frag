uniform vec3 uResolution;
uniform sampler2D uTexture;
uniform float uTime;
varying vec2 vUv;

float warp = 0.5; // simulate curvature of CRT monitor
float scanlineIntensity = 0.5; // intensity of scanlines

void main() {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = vUv;

    // Centered coordinates (-0.5 to 0.5)
    vec2 centeredUv = uv - 0.5;

    // Apply CRT curvature effect
    float curvature = warp * (centeredUv.x * centeredUv.x + centeredUv.y * centeredUv.y);
    centeredUv *= 1.0 + curvature;

    // Return to normalized coordinates
    uv = centeredUv + 0.5;

    // Check if UV coordinates are out of bounds
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        // Color out-of-bounds areas in black
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    // Sample the texture with the warped UV coordinates
    vec3 color = texture2D(uTexture, uv).rgb;

    // Add scanline effect
    float scanline = sin(uv.y * uResolution.y * 3.14159) * scanlineIntensity;
    color *= 1.0 - scanline;

    // Add a 3x3 black grid
    float gridThickness = 0.0025; // Thickness of the grid lines
    vec2 gridUv = fract(uv * 3.0); // Create a 3x3 grid
    if (gridUv.x < gridThickness || gridUv.y < gridThickness || 
        gridUv.x > 1.0 - gridThickness || gridUv.y > 1.0 - gridThickness) {
        color = vec3(0.0); // Black grid lines
    }

    // Output the final color
    gl_FragColor = vec4(color, 1.0);
}