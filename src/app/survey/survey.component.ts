import { GlobalService } from './../global.service';
import { Component, OnInit, Input } from '@angular/core';
import { Answer } from '../answer';
import { Survey } from '../survey';
import { NgForm } from '@angular/forms';
import { Client } from '../client';

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


  validateNegCom(myForm: NgForm) {
    const newAnswer = new Answer(
      null, false, null,
      new Survey(this.surveyId, null, null, null),
      null, this.modelAnswer.comment
    );
    this.service.createAnswer(newAnswer).subscribe(
      (answerFromJee) => {
        if (answerFromJee.id != null) {
          this.endMessage = 'Merci pour votre participation !';
          // this.service.isEnd = true;
          this.valeur = 3;
        }
      });
  }

  validatePosCom(id: number) {
    const newAnswer = new Answer(
      null, true, new Client(id, null, null, null, null, null),
      new Survey(this.surveyId, null, null, null), null, null
    );
    this.service.createAnswer(newAnswer).subscribe(
      (answerFromJee) => {
        if (answerFromJee.id != null) {
          this.setDays();
        }
      });
  }

  setDays() {
    this.service.getDays().subscribe(
      (numberDays) => {
        this.days = numberDays;
        const numDays = this.days > 3 ? this.days : 'quelques';
        // tslint:disable-next-line:max-line-length
        this.endMessage = `Merci pour votre réponse. Vous serez contacté dans un délai de ${numDays} jours par un de nos conseillers !`;
        // this.service.isEnd = true;
        this.valeur = 3;
      }
    );
  }


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
