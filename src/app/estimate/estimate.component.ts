import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
/**
 * Composant utilisé pour la demande d'un devis par un utilisateur.
 */
@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.css']
})
export class EstimateComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
  }

  /**
   * Méthode permettant la redirection vers Wikipedia lorsque l'utilisateur clique sur le bouton "Par téléphone" ou "Par Email".
   */
  goToUrl(): void {
    this.document.location.href = 'https://fr.wikipedia.org/';
  }

}
