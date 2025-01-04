import Range from "./range"
import { Label } from "../label"
import { Point } from "../svgraph"

export type DeepPartial<T> = T extends object
	? { [P in keyof T]?: DeepPartial<T[P]> }
	: T

export const maxBy = <T>(arr: T[], fn: (x: T) => number): T => (arr.length > 0) ? arr.reduce((a, b) => fn(a) > fn(b) ? a : b) : undefined
export const maxByKey = <T>(arr: T[], key: keyof T): T => (arr.length > 0) ? arr.reduce((a, b) => a[key] > b[key] ? a : b) : undefined

export const minBy = <T>(arr: T[], fn: (x: T) => number): T => (arr.length > 0) ? arr.reduce((a, b) => fn(a) < fn(b) ? a : b) : undefined
export const minByKey = <T>(arr: T[], key: keyof T): T => (arr.length > 0) ? arr.reduce((a, b) => a[key] < b[key] ? a : b) : undefined

const nearestIdx = (arr: number[], to: number): number =>
	minByKey(arr.map((x, idx) => [Math.abs(x - to), idx]), 0)[1]

export function nearestLabel(t: number, range: Range<Label>, data: { name: string, points: Point[] }[]) {
	const nearestLabelsIdx = data.map(({ points }) => nearestIdx(points.map(p => p.label.getPos(range)), t))
	const nearestLabels = nearestLabelsIdx.map((closestIdx, i) => data[i].points[closestIdx].label)
	return minBy(nearestLabels, l => Math.abs(l.getPos(range) - t))
}
