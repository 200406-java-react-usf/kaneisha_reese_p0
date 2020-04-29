export class Service{


    name: string;
    time: number[];
    cost: number[];

   constructor(name:string, hours:number[], earn:number[]){
       
       this.name = name;
       this.time = hours;
       this.cost = earn;
   }
}