import { babel } from "@rollup/plugin-babel";
import html from "@rollup/plugin-html";
import path from "path";
import { readFileSync } from "node:fs";
import image from "@rollup/plugin-image";
import dev from "rollup-plugin-dev";
// import css from "rollup-plugin-css-only";
import css from "rollup-plugin-import-css";
import sass from "rollup-plugin-sass";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import sourcemaps from "rollup-plugin-sourcemaps";

const production = !process.env.ROLLUP_WATCH;

const template = ({ meta, attributes, title, files, publicPath }) => {
  const filePath = path.resolve("public", "index.html");
  let result = readFileSync(filePath).toString();
  result = result
    .replace(
      "${metas}",
      meta.map(m => {
        const [key, value] = Object.entries(m).flat();
        return `<meta ${key} = "${value}"/>`;
      })
    )
    .replace("${title}", title)
    .replace(
      "${scripts}",
      `<script src="${publicPath + "/" + files.js[0].fileName}"></script>`
    );
  return result;
};

export default {
  input: "./src/index.js",
  output: {
    sourcemap: true,
    file: "dist/bundle.js",
    format: "esm",
    exports: "named",
    assetFileNames: "assets/[name]-[hash][extname]"
  },
  plugins: [
    babel({ babelHelpers: "bundled" }),
    css(),
    sass({
      output: "dist/bundle.css"
    }),
    image(),
    resolve(),
    html({
      title: "WDL Generator",
      template
    }),
    dev({
      spa: true,
      dirs: ["dist"],
      onListen(server) {
        server.log.info("Hello world");
      }
    }),
    sourcemaps(),
    production && terser() // minify, but only in production
  ]
};
