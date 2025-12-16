/*
 * @Author: eggYolkegg
 * @Date: 2025-12-11 15:41:51
 * @LastEditors: eggYolkegg
 * @LastEditTime: 2025-12-11 15:44:07
 * @Description:  
 */
import typescript from "rollup-plugin-typescript2";
import vue from "@vitejs/plugin-vue";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "es",
      exports: "named",
      sourcemap: true,
    },
    {
      file: pkg.unpkg,
      format: "umd",
      name: "VueContextMenu",
      exports: "named",
      sourcemap: true,
      globals: {
        vue: "Vue",
      },
    },
  ],
  external: ["vue"],
  plugins: [
    resolve(),
    commonjs(),
    vue(),
    postcss({
      inject: true,
      extract: false,
      modules: false,
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      useTsconfigDeclarationDir: true,
      exclude: ["node_modules", "**/*.vue"],
    }),
  ],
};
