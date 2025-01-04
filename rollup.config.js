import nodeResolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import terser from "@rollup/plugin-terser"
import dts from "rollup-plugin-dts"

export default [
	{
		input: "src/svgraph.ts",
		output: {
			dir: "out",
			sourcemap: true,
		},
		treeshake: false,
		plugins: [
			nodeResolve(),
			typescript(),
			terser({ format: { comments: /^!/ } })
		],
	},
	{
		input: "out/types/svgraph.d.ts",
		output: [{ file: "out/svgraph.d.ts", format: "es" }],
		plugins: [dts()],
	}
]
