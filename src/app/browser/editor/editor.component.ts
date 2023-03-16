import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash'
import { ActivatedRoute } from '@angular/router';

export interface EditorData {
	text: string
}

const BASE_DEFAULT_QUERY = `/* Write SQL Code here! */\n\nSELECT * FROM customer_details LIMIT 10\n\n`

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements OnInit {

	constructor(
		private route: ActivatedRoute) { }

	@Output() queryChanged = new EventEmitter<string>()
	data: EditorData[]
	editingTitle: string
	private queryKey: string
	private defaultQuery: string

	codemirrorOptions = {
		lineNumbers: true,
		theme: 'default',
		mode: 'sql',
		viewportMargin: Infinity
	}

	loadData(): void {
		const dataString = localStorage.getItem(this.queryKey)
		const parsed = this.parseQuery(dataString)
		if (parsed) {
			this.data = parsed
		} else {
			this.data = [{
				text: this.defaultQuery
			}]
		}
		this.saveData()
		this.queryChanged.next(this.data[0].text)
	}


	parseQuery(q: string): EditorData[] {
		if (!q) {
			return null
		}
		try {
			const parsed = JSON.parse(q)
			if (!(parsed instanceof Array)) {
				throw new Error()
			}
			if (parsed.length === 0) {
				throw new Error()
			}
			if (!_.every(parsed, (p: any) => 'text' in p)) {
				throw new Error()
			}
			return parsed
		} catch {
			return null
		}
	}

	saveData(): void {
		localStorage.setItem(this.queryKey, JSON.stringify(this.data))
	}

	ngOnInit() {
		this.route.queryParamMap.subscribe(map => {
			this.queryKey = (map.get('query_key') || 'default') + '-query-key'
			this.defaultQuery = map.get('default_query') || BASE_DEFAULT_QUERY
			this.loadData()
		})
	}

	textChange(data: EditorData, text: string) {
		this.queryChanged.next(text)
		data.text = text
		this.saveData()
	}

	exportQuery(): void {
		const file = new Blob([this.data[0].text], { type: 'text/plain' })
		const link = document.createElement('a')
		link.href = URL.createObjectURL(file)
		link.download = `${this.queryKey}_${new Date().toJSON().slice(0, 10)}.sql`
		link.click()
		link.remove()
	}

	importQuery(): void {
		const input = document.createElement('input') as HTMLInputElement
		input.accept = '.sql'
		input.type = 'file'
		input.onchange = (event: any) => {
			const file: File = event.target.files[0]
			file.text().then(content => {
				this.data[0].text = content
				this.saveData()
			})

		}

		input.click()
	}
}
