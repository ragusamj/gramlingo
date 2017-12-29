import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import uglify from "rollup-plugin-uglify";

export default {
    input: "src/app/app.js",
    output: {
        file: "dist/bundle.js",
        format: "iife",
        sourcemap: true
    },
    plugins: [
        commonjs(),
        resolve({
            module: false
        }),
        babel({
            babelrc: false,
            exclude: "/node_modules/**",
            presets: [["env", { "modules": false }]],
            plugins: ["external-helpers"]
        }),
        uglify()
    ]
};