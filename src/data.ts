import { parse } from "csv-parse/browser/esm/sync"
import { DateLabel, Label, MetricLabel, NumberLabel, TimeLabel } from "./label"

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

function getDatasetForPlayer(data: StatData, lastDate: number, player: string, stat: string): { label: Label, value: Label }[] {
	const linedata = data.filter(row => row.Player == player)
		.map(row => ({
			label: new DateLabel(new Date(row.Date)),
			value: new TimeLabel(Number(row[stat]) / 20),
		}))
		.flatMap((row, i, rows) => {
			const dayBeforeNext = new Date(rows[i + 1]?.label?.value ?? lastDate)
			dayBeforeNext.setUTCDate(dayBeforeNext.getUTCDate() - 1)
			if (dayBeforeNext.valueOf() == row.label.value.valueOf()) return [row]
			else return [row, { label: new DateLabel(dayBeforeNext), value: row.value }]
		})

	// Add first 0
	const dayBeforeFirst = new Date(linedata[0].label.value)
	dayBeforeFirst.setDate(dayBeforeFirst.getDate() - 2)
	linedata.unshift({
		label: new DateLabel(dayBeforeFirst),
		value: new TimeLabel(0),
	})
	return linedata
}

export async function getData(column: string) {
	const data: any[] = parse(await (await fetch("./stats.csv")).text(), { columns: true })
	const players: Set<string> = new Set(data.map(row => row.Player))
	const maxDate = data.map(row => new Date(row.Date).valueOf())
		.reduce((max, date) => Math.max(max, date), -Infinity)

	return Object.fromEntries([...players].map(player => [player, getDatasetForPlayer(data, maxDate, player, column)]))
}
