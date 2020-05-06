export class Animal{

    animal_id: number;
    name: string;
    groomer_id: number; //foreign key to a different table
    weight: number; // in lbs
    services: string[];


   constructor(id:number, name:string, groomer:number, weight:number, services:string[]){
       this.animal_id = id;
       this.name = name;
       this.groomer_id = groomer;
       this.weight = weight;
       this.services = services;

   }
}