export class Animal{

    id: number;
    name: string;
    ownerId: number; //foreign key to a different table
    weight: number; // in lbs
    services: string[];

   constructor(id:number, name:string, owner:number, weight:number, services: string[]){
       this.id = id;
       this.name = name;
       this.ownerId = owner;
       this.weight = weight;
       this.services = services;
   }
}