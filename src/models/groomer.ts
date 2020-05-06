export class Groomer{

    groomer_id: number;
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    earnings: number;
    hours: number;


    constructor(id:number, un: string, pass:string, fn:string, ln:string, hours:number, earn: number){
        this.groomer_id = id;
        this.username = un;
        this.password = pass;
        this.first_name = fn;
        this.last_name = ln;
        this.hours = hours;
        this.earnings = earn;
    }
}