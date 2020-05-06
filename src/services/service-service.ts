
import { Service } from "../models/service";
import { ServiceRepo } from "../repos/service-repo";
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


export class ServiceService {

    constructor(private serviceRepo: ServiceRepo){
        this.serviceRepo = serviceRepo
    }

    async getAllServices(): Promise<Service[]> {
        
        
        let service = await this.serviceRepo.getAll();

        if (service.length ==0) {
            throw new ResourceNotFoundError();
        }

        return service.map(this.removeCostAndHours);

    }

    async getServiceById(id: number): Promise<Service> {
    
        if (!isValidId(id)){
            throw new BadRequestError();
        }

        let service = await this.serviceRepo.getById(id);

        if (isEmptyObject(service)) {
            throw new ResourceNotFoundError();
        }

        return this.removeCostAndHours(service);
        
        
    }
  

    async addNewService(newService: Service): Promise<Service> {
        
        try {
            
            if (!isValidObject(newService, 'id')) {
                throw new BadRequestError('Invalid property values found in provided service.');
            }

            const persistedService = await this.serviceRepo.save(newService);

            return this.removeCostAndHours(persistedService);

        } catch (e) {
            throw e
        }

    }

    async updateService(updatedService: Service): Promise<Boolean> {
        
        try {

            if (!isValidObject(updatedService)) {
                throw new BadRequestError('Invalid service provided (invalid values found).');
    
            }
    
            let queryKeys = Object.keys(updatedService);
    
            if (!queryKeys.every(key => isPropertyOf(key, Service))) {
                throw new BadRequestError('teting5');
            }

            return await this.serviceRepo.update(updatedService);
            

        } catch (e) {
            throw e;
        }

    }

    async deleteById(id: number): Promise<boolean> {
        try{
            
    
            if(!isValidId(id)){
                throw new BadRequestError();
            }
            
            await this.serviceRepo.deleteById(id);
    
            return true;
    
        
       
        } catch (e) {
            throw e;
        }

    }

    private removeCostAndHours(service: Service): Service {
        if(!service || (!service.costs && !service.hours)) return service;
        let srv = {...service};
        delete srv["costs"];
        delete srv.hours;
        return srv;   
    }
}