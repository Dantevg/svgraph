import nodeResolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import terser from "@rollup/plugin-terser"

export default {
	input: "src/svgraph.ts",
	output: {
		dir: "out",
		sourcemap: true,
	},
	treeshake: false,
	plugins: [
		nodeResolve(),
		typescript(),
		terser({format: {comments: /^!/}})
	],
}
