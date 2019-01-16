import { Client } from './client';
import { Survey } from './survey';
/**
 * Classe modélisant une réponse au sondage de l'application.
 */
export class Answer {
    id: number;
    isPositive: boolean;
    client: Client;
    survey: Survey;
    entryDate: Date;
    comment: string;

    constructor(id: number, isPositive: boolean, client: Client, survey: Survey, entryDate: Date, comment: string) {
        this.id = id;
        this.isPositive = isPositive;
        this.client = client;
        this.survey = survey;
        this.entryDate = entryDate;
        this.comment = comment;
    }
}
