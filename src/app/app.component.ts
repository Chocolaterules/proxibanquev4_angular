import { Component, OnInit } from '@angular/core';
import { Survey } from './survey';
import { GlobalService } from './global.service';

/**
   * Composant racine de l'application. A l'initialisation, récupère le sondage en cours.
   */
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
/**
 * Méthode effectuée à l'initialisation pour récupérer le sondage en cours.
 */
  ngOnInit() {
    this.service.getCurrSurvey().subscribe(
      (s) => {
        console.log(s);
        // Si le WebService renvoie bien un sondage, on le stocke dans currSurvey.
        // valeur = 1 gère l'affichage du sondage.
        if (s !== null) {
          this.valeur = 1;
          this.currSurvey = new Survey(s.id, s.startDate, s.tempEndDate, s.endDate);
        } else {
          // Si le WebService ne renvoie rien, valeur = 2 permet d'afficher la page pour un devis.
          this.valeur = 2;
        }

      }
    );
  }
}
