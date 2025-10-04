import Range from "./range"
import { Label } from "../label"
import { Point } from "../svgraph"

export type DeepPartial<T> = T extends object
	? { [P in keyof T]?: DeepPartial<T[P]> }
	: T

/**
 * Any value that can be interpreted as a number.
 * 
 * This automatically includes the native `number` type.
 */
export type Value = { valueOf(): number }

export const maxBy = <T>(arr: T[], fn: (x: T) => number): T => (arr.length > 0) ? arr.reduce((a, b) => fn(a) > fn(b) ? a : b) : undefined
export const maxByKey = <T>(arr: T[], key: keyof T): T => (arr.length > 0) ? arr.reduce((a, b) => a[key] > b[key] ? a : b) : undefined

export const minBy = <T>(arr: T[], fn: (x: T) => number): T => (arr.length > 0) ? arr.reduce((a, b) => fn(a) < fn(b) ? a : b) : undefined
export const minByKey = <T>(arr: T[], key: keyof T): T => (arr.length > 0) ? arr.reduce((a, b) => a[key] < b[key] ? a : b) : undefined

export const floorTo = (n: number, to: number) => Math.floor(n / to) * to

const nearestIdx = (arr: number[], to: number): number =>
	minByKey(arr.map((x, idx) => [Math.abs(x - to), idx]), 0)[1]

export function nearestLabel(t: number, range: Range<Label>, data: { name: string, points: Point[] }[]) {
	const nearestLabelsIdx = data.map(({ points }) => nearestIdx(points.map(p => range.normalize(p.label)), t))
	const nearestLabels = nearestLabelsIdx.map((closestIdx, i) => data[i].points[closestIdx].label)
	return minBy(nearestLabels, l => Math.abs(range.normalize(l) - t))
}

export const nearestPointForLabel = (arr: Point[], to: Label, range: Range<Label>): Point =>
	minByKey(arr.map(x => [x, Math.abs(range.normalize(x.label) - range.normalize(to))]) as [Point, number][], 1)[0]
