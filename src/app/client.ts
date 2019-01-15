/**
 * Classe modélisant un client de Proxibanque.
 */
export class Client {
    id: number;
    firstName: string;
    lastName: string;
    telNum: string;
    email: string;
    clientNum: string;

    constructor(id: number, firstName: string, lastName: string, telNum: string, email: string, clientNum: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.telNum = telNum;
        this.email = email;
        this.clientNum = clientNum;
    }
}
