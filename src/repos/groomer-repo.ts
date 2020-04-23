import data from '../data/groomers-db'
import { Groomer } from '../models/groomer'
import { CrudRepo } from './crud-repo'

import { 
    BadRequestError, 
    ResourceNotFoundError 
} from '../errors/errors';

export class GroomerRepo implements CrudRepo<Groomer> {
    
    
    private static instance: GroomerRepo;
    private constructor() { }

    static getInstance() {
        return !GroomerRepo.instance ? GroomerRepo.instance = new GroomerRepo() : GroomerRepo.instance;
    }

    getAll(): Promise<Groomer[]> {
        console.log(data);
        return new Promise<Groomer[]>((resolve, reject) =>{

            setTimeout(()=>{
                let groomers: Groomer[] = [];

                for(let groomer of data) {
                    groomers.push({...groomer});
                }

                if (groomers.length == 0){
                    reject('error');
                    return;
                }

                resolve(groomers);
            }, 250)
        })
    }

    getById(id: number): Promise<Groomer> {
    
        return new Promise<Groomer>((resolve, reject) => {
    
            if (typeof id !== 'number' || !Number.isInteger(id) || id <= 0) {
                reject(new BadRequestError());
                return;
            }
    
            setTimeout(function() {
    
                const groomer: Groomer = {...data.filter(groomer => groomer.id === id).pop()};
                
                if (!groomer) {
                    reject(new ResourceNotFoundError());
                    return;
                }
                resolve(groomer);
    
            }, 5000);
    
        });
        
    }

    save(newGroomer: Groomer): Promise<Groomer> {
        return new Promise((resolve, reject) => {
            reject('Not implemented');
        });
    }

    update(updatedGroomer: Groomer): Promise<boolean> {
        return new Promise((resolve, reject) => {
            reject('Not implemented');
        });
    }

    deleteById(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            reject('Not implemented');
        })
    }
}