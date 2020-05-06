import { GroomerRepo } from '../repos/groomer-repo';
import { GroomerService } from '../services/groomer-service';
import { ServiceRepo } from '../repos/service-repo';
import { ServiceService } from '../services/service-service';
import { AnimalService } from '../services/animal-service';
import { AnimalRepo } from '../repos/animal-repo';

const groomerRepo = new GroomerRepo();
const groomerService = new GroomerService(groomerRepo);
const serviceRepo = new ServiceRepo();
const serviceService = new ServiceService(serviceRepo);
const animalRepo = new AnimalRepo();
const animalService = new AnimalService(animalRepo);

export default {
    groomerService,
    serviceService,
    animalService
}   