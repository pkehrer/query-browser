import { Component, ChangeDetectorRef, OnInit } from '@angular/core'
import { DBResult } from '../types/dbResult'
import { SqliteService } from '../sqlite.service'
import * as _ from 'lodash'
import { HostListener } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';


@Component({
	selector: 'app-browser',
	templateUrl: './browser.component.html',
	styleUrls: ['./browser.component.scss'],
})
export class BrowserComponent implements OnInit {

	appName: string
	approvedAppNames = ['data-science-infinity']

	constructor(
		private sqlite: SqliteService,
		private changeDetector: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute,
		private router: Router) {
		this.activatedRoute.paramMap.subscribe(p => {
			this.appName = p.get('appName')
			if (!this.approvedAppNames.includes(this.appName)) {
				this.router.navigate(['/'])
			}
		})
	}


	query: string
	error: string
	results: DBResult
	running = false
	sqlReady = false

	ngOnInit() {
		this.sqlite.initialize().then(() => this.sqlReady = true)
	}

	onQueryChanged(query: string) {
		this.query = query
	}

	@HostListener('document:keypress', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		if (event.code === 'Enter' && !event.ctrlKey && event.shiftKey) { // "Shift + Enter"
			this.run()
			event.preventDefault()
		} else if (event.code === 'Enter' && event.ctrlKey) { // "Ctrl + Enter"
			this.runSelected()
			event.preventDefault()
		}
	}

	runQuery(query: string): void {
		if (!this.sqlReady) {
			return
		}
		this.running = true
		this.changeDetector.detectChanges()
		setTimeout(() => {
			this.sqlite.runQuery(query)
				.then(results => {
					this.results = results

					this.error = null
				})
				.catch(e => {
					this.error = `Error: ${e.message}`
					console.log(e)
				})
				.then(() => {
					this.running = false
				})
		}, 1)
	}

	run(): void {
		this.runQuery(this.query)
	}

	runSelected(): void {
		if (window.getSelection) {
			this.runQuery(window.getSelection().toString())
		} else {
			this.run()
		}
	}
}
