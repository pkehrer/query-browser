import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { AngularSplitModule } from 'angular-split'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { CodemirrorModule } from '@ctrl/ngx-codemirror'
import { AgGridModule } from 'ag-grid-angular'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserComponent } from './browser/browser.component'
import { ResultsComponent } from './browser/results/results.component'
import { SchemaComponent } from './browser/schema/schema.component'
import { SpinnerComponent } from './spinner/spinner.component'
import { ResultComponent } from './browser/results/result/result.component';
import { EditorComponent } from './browser/editor/editor.component';
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [
    AppComponent,
    BrowserComponent,
    ResultsComponent,
    SchemaComponent,
    SpinnerComponent,
    ResultComponent,
    EditorComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AngularSplitModule,
    NgbModule,
    CodemirrorModule,
    AgGridModule.withComponents([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
