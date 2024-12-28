//DOES NOT WORK YET
import { defineConfig } from "rolldown";

export default defineConfig({
  input: "lib/index.ts",
  external: /node_modules/,
  plugins: [],
  output: [
    {
      format: "commonjs",
      file: "build/csj/index.js",
    },
    {
      format: "esm",
      file: "build/esm/index.js",
    },
  ],
});
