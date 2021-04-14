import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import scss from "rollup-plugin-scss";
import typescript from "@rollup/plugin-typescript";

const preprocessOptions = require("./svelte.config").preprocessOptions;
const production = !process.env.ROLLUP_WATCH;

function toExit() {
  if (server) server.kill(0);
}

function serve() {
  let server;
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
        // enable run-time checks when not in production
        dev: !production,
      },
    }),

    scss({
      output: `./public/build/bundle.css`,
      outputStyle: production ? "compressed" : "compact",
    }),
    // css({ output: "bundle.css" }),

    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),
    typescript({
      sourceMap: true,
      inlineSources: !production,
    }),

    !production && serve(),

    !production && livereload("public"),

    production && terser({ output: { comments: false } }),
  ],
  watch: {
    clearScreen: false,
  },
};
