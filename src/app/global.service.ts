import { Client } from './client';
import { Answer } from './answer';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as ENV } from '../environments/environment';
import { Survey } from './survey';
import { Observable } from 'rxjs';
/**
 * Classe de service regroupant l'ensemble des méthodes de communication avec le WebService J2EE.
 */
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  surveyUrl: string;
  answerUrl: string;
  clientUrl: string;
  currSurvey: Survey;
  days: number;


  constructor(private httpClient: HttpClient) {
    this.days = 0;
    this.surveyUrl = ENV.apiUrl + '/survey';
    this.answerUrl = ENV.apiUrl + '/answer';
    this.clientUrl = ENV.apiUrl + '/client';
    this.currSurvey = new Survey(undefined, undefined, undefined, undefined);
  }

  /**
   * Méthode permettant d'interroger le WebService pour récupérer le sondage en cours.
   * @returns Observable<Survey> L'observable pour le sondage en cours.
   */
  public getCurrSurvey(): Observable<Survey> {
    return this.httpClient.get<Survey>(this.surveyUrl);
  }

  /**
   * Méthode permettant d'interroger le WebService pour persister une réponse d'un client en BDD.
   * @returns Observable<Survey> L'observable pour la réponse sauvegardée en BDD.
   */
  public createAnswer(answer: Answer): Observable<Answer> {
    const newAnswer = new Answer(undefined, answer.isPositive, answer.client, answer.survey, answer.entryDate, answer.comment);
    return this.httpClient.post<Answer>(this.answerUrl, newAnswer);
  }

  /**
   * Méthode permettant d'interroger le WebService pour sauvegarder un nouveau client en BDD.
   * @returns Observable<Survey> L'observable pour le client nouvellement enregistré.
   */
  public createClient(client: Client): Observable<Client> {
    const newClient = new Client(null, client.firstName, client.lastName, client.telNum, client.email, client.clientNum);
    return this.httpClient.post<Client>(this.clientUrl, newClient);
  }

  /**
   * Méthode permettant d'interroger le WebService pour récupérer un client à partir de son identifiant à 8 chiffres.
   * @returns Observable<Survey> L'observable pour le client récupéré depuis la BDD.
   */
  public readClientNum(clientNum: string): Observable<Client> {
    return this.httpClient.get<Client>(this.clientUrl + `/${clientNum}`);
  }

  /**
   * Méthode permettant d'interroger le WebService pour récupérer le nombre de jours entre la fin d'un sondage et la date du jour.
   * @returns Observable<Survey> L'observable pour le nombre de jours sous forme de nombre.
   */
  public getDays(): Observable<number> {
    return this.httpClient.get<number>(this.surveyUrl + '/date');

  }
}
