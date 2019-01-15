import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SurveyComponent } from './survey/survey.component';
import { EstimateComponent } from './estimate/estimate.component';


@NgModule({
  declarations: [
    AppComponent,
    SurveyComponent,
    EstimateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
