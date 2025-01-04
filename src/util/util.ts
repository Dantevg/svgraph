export type DeepPartial<T> = T extends object
	? { [P in keyof T]?: DeepPartial<T[P]> }
	: T

export const maxBy = <T>(arr: T[], fn: (x: T) => number): T => (arr.length > 0) ? arr.reduce((a, b) => fn(a) > fn(b) ? a : b) : undefined
export const maxByKey = <T>(arr: T[], key: keyof T): T => (arr.length > 0) ? arr.reduce((a, b) => a[key] > b[key] ? a : b) : undefined

export const minBy = <T>(arr: T[], fn: (x: T) => number): T => (arr.length > 0) ? arr.reduce((a, b) => fn(a) < fn(b) ? a : b) : undefined
export const minByKey = <T>(arr: T[], key: keyof T): T => (arr.length > 0) ? arr.reduce((a, b) => a[key] < b[key] ? a : b) : undefined
