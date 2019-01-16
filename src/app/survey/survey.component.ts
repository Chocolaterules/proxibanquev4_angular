import { GlobalService } from './../global.service';
import { Component, OnInit, Input } from '@angular/core';
import { Answer } from '../answer';
import { Survey } from '../survey';
import { NgForm } from '@angular/forms';
import { Client } from '../client';
/**
 * COmposant utilisé pour afficher les formulaires d'enregistrement des commentaires postés par les utilisateurs.
 */
@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  @Input() surveyId: number;

  newClientOk: boolean;
  oldClientOk: boolean;
  days: number;
  modelAnswer: Answer;
  modelClient: Client;
  valeur: number;
  endMessage: string;

  constructor(private service: GlobalService) {
    this.days = 0;
    this.valeur = 0;
    this.newClientOk = true;
    this.oldClientOk = true;
    this.modelAnswer = new Answer(null, null, null, null, null, null);
    this.modelClient = new Client(null, null, null, null, null, null);
  }

  ngOnInit() {
  }


  positive() {
    this.valeur = 1;
  }


  negative() {
    this.valeur = 2;
  }

  /**
   * Methode permettant d'enregistrer un commentaire négatif pour le sondage en cours.
   * @param myForm Le formulaire d'enregistrement du commentaire.
   */
  validateNegCom(myForm: NgForm) {
    // Création d'une nouvelle réponse avec l'id du sondage en cours.
    // Obligation de passer par un objet Survey contenant juste un attribut id rempli avec l'id du sondage en cours
    // pour que le WebService puisse stocker l'information dans la colonne survey_id en BDD.
    // On fixe isPositive à false directement.
    const newAnswer = new Answer(
      null, false, null,
      new Survey(this.surveyId, null, null, null),
      null, this.modelAnswer.comment
    );
    this.service.createAnswer(newAnswer).subscribe(
      (answerFromJee) => {
        if (answerFromJee.id != null) {
          // tslint:disable-next-line:max-line-length
          // Une fois que le servuer a renvoyé la réponse enregistrée en BDD avec un id, on bascule sur l'affichage du message de remerciement
          // avec valeur = 3.
          this.endMessage = 'Merci pour votre participation !';
          this.valeur = 3;
        }
      });
  }
  /**
     * Methode permettant d'enregistrer un commentaire positif pour le sondage en cours.
     * @param myForm Le formulaire d'enregistrement du commentaire.
     */
  validatePosCom(id: number) {
    // Création d'une nouvelle réponse avec l'id du sondage en cours.
    // Obligation de passer par un objet Survey contenant juste un attribut id rempli avec l'id du sondage en cours
    // pour que le WebService puisse stocker l'information dans la colonne survey_id en BDD.
    // On fixe isPositive à true directement.
    const newAnswer = new Answer(
      null, true, new Client(id, null, null, null, null, null),
      new Survey(this.surveyId, null, null, null),
      null, null);
    this.service.createAnswer(newAnswer).subscribe(
      (answerFromJee) => {
        if (answerFromJee.id != null) {
          // Si la réponse renvoyée par le serveur existe bien, on appelle setDays() qui demande au WebService le nombre de jours
          // entre la date du jour et la fin prévisionnelle du sondage en cours.
          this.setDays();
        }
      });
  }
  /**
   * Methode utilisant le webService pour connaitre le nombre de jours restants avant la fin prévisionnelle du sondage en cours.
   * Si le nombre de jours restant vaut 1 ou 0, affichage de "quelques jours" à l'utilisateur au lieu de "0/1 jours"
   */
  setDays() {
    this.service.getDays().subscribe(
      (numberDays) => {
        this.days = numberDays;
        const numDays = this.days > 1 ? this.days : 'quelques';
        // tslint:disable-next-line:max-line-length
        this.endMessage = `Merci ! Vous serez contacté dans un délai de ${numDays} jours par un de nos conseillers !`;
        this.valeur = 3;
      }
    );
  }

  /**
   * Methode permettant d'enregistrer un nouveau client ayant posté un avis positif pour le sondage en cours.
   * Le client a forcément enregistré soit un email soit un numéro de téléphone.
   * @param client Le client à sauvegarder en BDD.
   *
   */
  createClient(client: Client) {
    const newClient = new Client(null, client.firstName, client.lastName,
      client.telNum, client.email, null);
    this.service.createClient(newClient).subscribe(
      (clientFromJee) => {
        if (clientFromJee.id != null) {
          this.validatePosCom(clientFromJee.id);
        }
      }
    );
  }

  checkClient(myForm: NgForm) {
    const cliNum = this.modelClient.clientNum;
    this.service.readClientNum(cliNum).subscribe(
      (cliFromJee) => {
        if (cliFromJee != null) {
          this.oldClientOk = true;
          const cliId = cliFromJee.id;
          this.validatePosCom(cliId);
        } else {
          this.oldClientOk = false;
        }
      }
    );
  }

  validateAndSend(myForm: NgForm): boolean {
    if (!this.modelClient.telNum && !this.modelClient.email) {
      return this.newClientOk = false;
    } else {
      const newClient = new Client(null, this.modelClient.firstName, this.modelClient.lastName,
        this.modelClient.telNum, this.modelClient.email, null);
      this.createClient(newClient);
      return this.newClientOk = true;
    }
  }

}
