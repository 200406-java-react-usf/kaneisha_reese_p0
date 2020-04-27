export class Groomer{

     id: number;
     firstName: string;
     lastName: string;
     hoursWorked: number;
     earnings: number;

    constructor(id:number, fn:string, ln:string, hours:number, earn: number){
        this.id = id;
        this.firstName = fn;
        this.lastName = ln;
        this.hoursWorked = hours;
        this.earnings = earn;
    }
}