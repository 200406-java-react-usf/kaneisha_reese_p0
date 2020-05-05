export class Service{

    id: number;
    name: string;
    costs: number[];
    hours: number[];


   constructor(id: number, name:string, costs: number[], hours: number[];){
       this.id = id;
       this.name = name;
       this.costs = costs;
       this.hours = hours;

   }
}