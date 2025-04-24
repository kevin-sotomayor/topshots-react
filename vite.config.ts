import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import glsl from "vite-plugin-glsl";


export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), glsl()],
});
