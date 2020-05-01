export class Animal{

    id: number;
    name: string;
    groomerId: number; //foreign key to a different table
    weight: number; // in lbs
    status: boolean;
    size: number;


   constructor(id:number, name:string, groomer:number, weight:number, status:boolean){
       this.id = id;
       this.name = name;
       this.groomerId = groomer;
       this.weight = weight;
       this.status = status;

       if (weight < 15){
           this.size = 1;
       }
        else if (weight < 30){
           this.size = 2;
       } 
       else {
           this.size = 3;
        }

   }
}