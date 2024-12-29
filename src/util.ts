// Array-like functions for objects
// https://stackoverflow.com/a/37616104

export const filter = <V>(obj: { [k: string]: V }, predicate: (_: V) => boolean): { [k: string]: V } =>
	Object.fromEntries(Object.entries(obj).filter(([_, v]) => predicate(v)))

export const map = <V>(obj: { [k: string]: V }, mapper: (k: string, v: V) => V) =>
	Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, mapper(k, v)]))
