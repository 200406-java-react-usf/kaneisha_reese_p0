export class Service{

    service_id: number;
    name: string;
    costs: number[];
    hours: number[];


   constructor( service_id: number, name:string, costs: number[], hours: number[]){
       this.service_id = service_id;
       this.name = name;
       this.costs = costs;
       this.hours = hours;

   }
}