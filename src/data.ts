import { parse } from "csv-parse/browser/esm/sync"
import { DateLabel, Label, NumberLabel } from "./label"

type StatData = { Date: string, Player: string }[]

function datesBetween(from: Date, to: Date, inclusive: boolean): Date[] {
	const dates = []
	let current = from
	while (inclusive ? current <= to : current < to) {
		dates.push(new Date(current))
		current.setUTCDate(current.getUTCDate() + 1)
	}
	return dates
}

function getDatasetForPlayer(data: StatData, dates: string[], player: string, stat: string): { label: Label, value: number }[] {
	const linedata = data.filter(row => row.Player == player)
		.map(row => ({
			label: new DateLabel(new Date(row.Date)),
			value: Number(row[stat]),
		}))
		.flatMap((row, i, rows) => {
			const dayBeforeNext = new Date(rows[i + 1]?.label?.value ?? dates.at(-1))
			dayBeforeNext.setUTCDate(dayBeforeNext.getUTCDate() - 1)
			if (dayBeforeNext.valueOf() == row.label.value.valueOf()) return [row]
			else return [row, { label: new DateLabel(dayBeforeNext), value: row.value }]
		})

	// Add first 0
	const dayBeforeFirst = new Date(linedata[0].label.value)
	dayBeforeFirst.setDate(dayBeforeFirst.getDate() - 2)
	linedata.unshift({
		label: new DateLabel(dayBeforeFirst),
		value: 0,
	})
	return linedata
}

export async function getData(column: string) {
	const data = parse(await (await fetch("./stats.csv")).text(), { columns: true })
	const players: Set<string> = new Set(data.map(row => row.Player))
	const [minDate, maxDate] = data.map(row => new Date(row.Date).valueOf())
		.reduce(
			([min, max], date) => [Math.min(min, date), Math.max(max, date)],
			[Infinity, -Infinity])
	const dates = datesBetween(new Date(minDate), new Date(maxDate), true)
		.map(date => date.toISOString().split("T")[0])

	return Object.fromEntries([...players].map(player => [player, getDatasetForPlayer(data, dates, player, column)]))
}
