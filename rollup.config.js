import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import tildeImporter from 'node-sass-tilde-importer';
import scss from "rollup-plugin-scss";
import typescript from "@rollup/plugin-typescript";

const production = !process.env.ROLLUP_WATCH;

let server;
function toExit() {
  if (server) server.kill(0);
}
function serve() {
  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn(
        "yarn",
        ["watch"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );
      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

const preprocessOptions = {
  sourceMap: true,
  sass: true,
  typescript: true,
  defaults: {
    script: "typescript",
    style: "scss",
  },
  scss: {
    prependData: `@import './src/styles/**/*';`,
  },
  postcss: {
    plugins: [require("autoprefixer")()],
  },
};

export default {
  input: "src/index.ts",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess({
        ...preprocessOptions,
        sourceMap: !production,
      }),
      emitCss: true,
      preprocess: sveltePreprocess({ sourceMap: !production }),
      compilerOptions: {
        dev: !production,
      },
    }),

    scss({
      importer: tildeImporter,
      output: `./public/build/bundle.css`,
      outputStyle: production ? "compressed" : "compact",
      watch: "./src/styles",
    }),

    typescript({
      sourceMap: true,
      inlineSources: !production
    }),

    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),

    !production && serve(),

    !production && livereload("public"),

    production && terser({ sourcemap: isDev, output: { comments: false } }),
  ],
  watch: {
    clearScreen: false,
  },
};
