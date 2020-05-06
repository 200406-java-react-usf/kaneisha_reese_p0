export interface GroomerSchema {
    groomer_id: number;
    username: string,
    password: string,
    first_name: string;
    last_name: string;
    earnings: number;
    hours: number

}

export interface ServiceSchema {
    service_id: number;
    name: string;
    costs: number[];
    hours: number[];
}

export interface AnimalSchema {
    animal_id: number;
    name: string;
    groomer_id: number; 
    weight: number; 
    services: string[];
}