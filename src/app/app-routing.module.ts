import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { BrowserComponent } from './browser/browser.component'
import { TestComponent } from './test/test.component'
const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'data-science-infinity'

	},
	{
		path: ':appName',
		component: BrowserComponent
	}
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
