import { Animal } from "../models/animal";
import { AnimalRepo } from "../repos/animal-repo";
import { 
    isValidId,  
    isValidObject, 
    isPropertyOf, 
    isEmptyObject 
}  from '../util/validator';
import { 
    BadRequestError, 
    ResourceNotFoundError, 
} from "../errors/errors";


export class AnimalService {

    constructor(private animalRepo: AnimalRepo){
        this.animalRepo = animalRepo
    }

    async getAllAnimals(): Promise<Animal[]> {
        
        
        let animal = await this.animalRepo.getAll();

        if (animal.length ==0) {
            throw new ResourceNotFoundError();
        }

        return animal;

    }

    async getAnimalById(id: number): Promise<Animal> {
    
        if (!isValidId(id)){
            throw new BadRequestError();
        }

        let animal = await this.animalRepo.getById(id);

        if (isEmptyObject(animal)) {
            throw new ResourceNotFoundError();
        }

        return animal;
        
        
    }
  

    async addNewAnimal(newAnimal: Animal): Promise<Animal> {
        
        try {
            
            if (!isValidObject(newAnimal, 'id')) {
                throw new BadRequestError('Invalid property values found in provided animal.');
            }

            const persistedAnimal = await this.animalRepo.save(newAnimal);

            return persistedAnimal;

        } catch (e) {
            throw e
        }

    }

    async updateAnimal(updatedAnimal: Animal): Promise<Boolean> {
        
        try {

            if (!isValidObject(updatedAnimal)) {
                throw new BadRequestError('Invalid animal provided (invalid values found).');
    
            }
    
            let queryKeys = Object.keys(updatedAnimal);
    
            if (!queryKeys.every(key => isPropertyOf(key, Animal))) {
                throw new BadRequestError('teting5');
            }

            return await this.animalRepo.update(updatedAnimal);
            

        } catch (e) {
            throw e;
        }

    }

    async deleteById(id: number): Promise<boolean> {
        try{
            
    
            if(!isValidId(id)){
                throw new BadRequestError();
            }
            
            await this.animalRepo.deleteById(id);
    
            return true;
    
        
       
        } catch (e) {
            throw e;
        }

    }
}
