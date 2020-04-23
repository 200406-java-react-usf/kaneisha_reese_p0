export class Groomer{

    private _id: number;
    private _firstName: string;
    private _lastName: string;
    private _hoursWorked: number;
    private _earnings: number;

    constructor(id:number, fn:string, ln:string, hours:number, earnings: number){
        this._id = id;
        this._firstName = fn;
        this._lastName = ln;
        this._hoursWorked = hours;
        this._earnings = earnings;
    }

     get id(): number{
        return this._id;
    } 

     set id(newId:number){
         this._id = newId;
     }

     get firstName(): string{
        return this._firstName;
    } 

     set firstName (newFn:string){
         this._firstName = newFn;
     }

     get lastName(): string{
        return this._lastName;
    } 

     set lastName(newLn:string){
         this._lastName = newLn;
     }

     get hoursWorked(): number{
        return this._hoursWorked;
    } 

     set hoursWorked(newHours:number){
         this._hoursWorked = newHours;
     }
     
     get earnings(): number{
        return this._earnings;
    } 

     set earnings(newEarnings:number){
         this._earnings = newEarnings;
     }
}