import { parse } from "csv-parse/browser/esm/sync"
import { Label, NumberLabel } from "./label"

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
			label: new Date(row.Date).toISOString().split("T")[0],
			value: Number(row[stat]),
		}))
		.flatMap((row, i, rows) => {
			const days = datesBetween(new Date(row.label), new Date(rows[i + 1]?.label ?? dates.at(-1)), i == rows.length - 1)
			// return days.map(day => ({ label: day.toISOString().split("T")[0], value: row.value }))
			return days.map(day => ({ label: new NumberLabel(Math.floor(day.valueOf() / 1000 / 60 / 60 / 24)), value: row.value }))
		})
	// Add first 0 for everyone
	linedata.unshift({
		label: new NumberLabel(Math.floor(new Date(dates[0]).valueOf() / 1000 / 60 / 60 / 24)),
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