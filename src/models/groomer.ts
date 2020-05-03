export class Groomer{

     id: number;
     username: string;
     password: string;
     firstName: string;
     lastName: string;
     hoursWorked: number;
     earnings: number;

    constructor(id:number, un: string, pass:string, fn:string, ln:string, hours:number, earn: number){
        this.id = id;
        this.username = un;
        this.password = pass;
        this.firstName = fn;
        this.lastName = ln;
        this.hoursWorked = hours;
        this.earnings = earn;
    }
}