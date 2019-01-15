import { Answer } from './answer';
/**
 * Classe modélisant un sondage de l'application.
 */
export class Survey {

    id: number;
    startDate: Date;
    tempEndDate: Date;
    endDate: Date;
    answers: Array<Answer>;

    constructor(id: number, startDate: Date, tempEndDate: Date, endDate: Date, answers?: Array<Answer>) {
        this.id = id;
        this.startDate = startDate;
        this.tempEndDate = tempEndDate;
        this.endDate = endDate;
        this.answers = answers;

    }
}
