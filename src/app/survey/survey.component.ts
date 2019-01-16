import { GlobalService } from './../global.service';
import { Component, OnInit, Input } from '@angular/core';
import { Answer } from '../answer';
import { Survey } from '../survey';
import { NgForm } from '@angular/forms';
import { Client } from '../client';
/**
 * Composant utilisé pour afficher les formulaires d'enregistrement des commentaires postés par les utilisateurs.
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

/**
 * Méthode fixant la variable valeur à 1 pour afficher le formulaire d'enregistrement du client après un avis positif.
 */
  positive() {
    this.valeur = 1;
  }

/**
 * Méthode fixant la variable valeur à 2 pour afficher le formulaire d'enregistrement du commentaire après un avis négatif.
 */
  negative() {
    this.valeur = 2;
  }

  /**
   * Méthode permettant d'enregistrer un commentaire négatif pour le sondage en cours.
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
          // Une fois que le serveur a renvoyé la réponse enregistrée en BDD avec un id,
          // on bascule sur l'affichage du message de remerciement en fixant valeur = 3.
          this.endMessage = 'Merci pour votre participation !';
          this.valeur = 3;
        }
      });
  }
 /**
  * Méthode permettant d'enregistrer un avis positif pour le sondage en cours.
  * @param id L'identifiant du client qui a laissé l'avis positif.
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
   * Méthode utilisant le webService pour connaitre le nombre de jours restants avant la fin prévisionnelle du sondage en cours.
   * Si le nombre de jours restant est inférieur à 2, affichage de "quelques jours" à l'utilisateur au lieu de "0/1/-n jours".
   */
  setDays() {
    this.service.getDays().subscribe(
      (numberDays) => {
        this.days = numberDays;
        const numDays = this.days > 1 ? this.days : 'quelques';
        // tslint:disable-next-line:max-line-length
        this.endMessage = `Merci ! Vous serez contacté dans un délai de ${numDays} jours par un de nos conseillers experts en assurance auto !`;
        this.valeur = 3;
      }
    );
  }

  /**
   * Méthode permettant d'enregistrer un nouveau client ayant posté un avis positif pour le sondage en cours.
   * Le client a forcément enregistré soit un email soit un numéro de téléphone (cf validateAndSend()).
   * @param client Le client à sauvegarder en BDD.
   *
   */
  createClient(client: Client) {
    const newClient = new Client(null, client.firstName, client.lastName,
      client.telNum, client.email, null);
    this.service.createClient(newClient).subscribe(
      (clientFromJee) => {
        if (clientFromJee.id != null) {
          // Si le nouveau client a bien été ajouté en BDD alors
          // on envoie son id à validatePosCom() pour sauvegarder la réponse liée à ce client.
          this.validatePosCom(clientFromJee.id);
        }
      }
    );
  }
  /**
   * Méthode permettant de vérifier si un utilisateur est effectivement un client actuel de la banque
   * en contrôlant l'existence de son identifiant à 8 chiffres en BDD. Le formulaire html oblige l'utilisateur à saisir 8 chiffres
   * dans ce formulaire.
   * @param myForm Le formulaire d'enregistrement de l'identifiant du client.
   */
  checkClient(myForm: NgForm) {
    // Récupération de l'identifiant à 8 chiffres enregistré dans le formulaire au moment de la validation.
    const cliNum = this.modelClient.clientNum;
    this.service.readClientNum(cliNum).subscribe(
      (cliFromJee) => {
        if (cliFromJee != null) {
          // Si le WebService a renvoyé le client avec un id. On transmet l'id à validatePosCom()
          // pour enregistrer l'avis de ce client en BDD.
          this.oldClientOk = true;
          const cliId = cliFromJee.id;
          this.validatePosCom(cliId);
        } else {
          // Si le client n'existe pas en BDD on ne valide pas l'avis
          // et affichage d'un message d'erreur à l'utilisateur.
          this.oldClientOk = false;
        }
      }
    );
  }
  /**
   * Méthode de contrôle pour le formulaire d'enregistrement d'un nouveau client. Si le client n'a saisi
   * ni email ni numéro de téléphone, le formulaire n'est pas validé.
   * Le nom et le prénom sont par défaut requis dans le formulaire html.
   * @param myForm Le formulaire d'enregistrement d'un nouveau client.
   */
  validateAndSend(myForm: NgForm): boolean {
    if (!this.modelClient.telNum && !this.modelClient.email) {
      return this.newClientOk = false;
    } else {
      // Si le client a au moins saisi un numéro de téléphone ou une adresse email, on passe ce client à createClient().
      const newClient = new Client(null, this.modelClient.firstName, this.modelClient.lastName,
        this.modelClient.telNum, this.modelClient.email, null);
      this.createClient(newClient);
      return this.newClientOk = true;
    }
  }

}
