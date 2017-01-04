import { BrowserModule }                from '@angular/platform-browser';
import { ReactiveFormsModule }          from '@angular/forms';
import { NgModule }                     from '@angular/core';
import { HttpModule }                   from '@angular/http';
import { NgbModule }                    from '@ng-bootstrap/ng-bootstrap';

import { AppComponent }                 from './app.component';
import { DynamicFormComponent }         from './dynamic-form.component';
import { DynamicFormQuestionComponent } from './dynamic-form-question.component';
import { ChartModule } from 'angular2-chartjs';

@NgModule({
  imports: [ BrowserModule, ReactiveFormsModule, HttpModule, NgbModule.forRoot(), ChartModule],
  declarations: [ AppComponent, DynamicFormComponent, DynamicFormQuestionComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor() {
  }
}