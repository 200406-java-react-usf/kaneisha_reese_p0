export class Groomer{

     id: number;
     firstName: string;
     lastName: string;
     username: string;
     password: string;
     hoursWorked: number;
     earnings: number;

    constructor(id:number, fn:string, ln:string, hours:number, earn: number){
        this.id = id;
        this.firstName = fn;
        this.lastName = ln;
        this.username = `${ln}.${fn}`;
        this.password = `${ln}${id}`;
        this.hoursWorked = hours;
        this.earnings = earn;
    }
}