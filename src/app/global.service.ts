import { Client } from './client';
import { Answer } from './answer';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as ENV } from '../environments/environment';
import { Survey } from './survey';
import { Observable } from 'rxjs';

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

  public getCurrSurvey(): Observable<Survey> {
    return this.httpClient.get<Survey>(this.surveyUrl);
  }

  public createAnswer(answer: Answer): Observable<Answer> {
    const newAnswer = new Answer(undefined, answer.isPositive, answer.client, answer.survey, answer.entryDate, answer.comment);
    return this.httpClient.post<Answer>(this.answerUrl, newAnswer);
  }

  public createClient(client: Client): Observable<Client> {
    const newClient = new Client(null, client.firstName, client.lastName, client.telNum, client.email, client.clientNum);
    return this.httpClient.post<Client>(this.clientUrl, newClient);
  }

  public readClientNum(clientNum: string): Observable<Client> {
    return this.httpClient.get<Client>(this.clientUrl + `/${clientNum}`);
  }

  public getDays(): Observable<number> {
    return this.httpClient.get<number>(this.surveyUrl + '/date');

  }
}
