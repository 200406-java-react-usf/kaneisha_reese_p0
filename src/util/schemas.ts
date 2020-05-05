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
    id: number;
    name: string;
    costs: number[];
    hours: number[];


}