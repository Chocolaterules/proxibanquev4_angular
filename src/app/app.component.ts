import { Component, OnInit } from '@angular/core';
import { Survey } from './survey';
import { GlobalService } from './global.service';
import { VirtualTimeScheduler } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'proxibanquev4-angular';
  currSurvey: Survey;
  valeur: number;


  constructor(public service: GlobalService) {
    this.valeur = 0;
    this.currSurvey = new Survey(undefined, undefined, undefined, undefined);
  }

  ngOnInit() {
    this.service.getCurrSurvey().subscribe(
      (s) => {
        console.log(s);
        if (s !== null) {
          this.valeur = 1;
          this.currSurvey = new Survey(s.id, s.startDate, s.tempEndDate, s.endDate);
        } else {
          this.valeur = 2;
          console.log(this.valeur);
        }

      }
    );
  }
}
