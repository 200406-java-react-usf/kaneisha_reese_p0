import { GroomerRepo } from '../repos/groomer-repo';
import { GroomerService } from '../services/groomer-service';
import { ServiceRepo } from '../repos/service-repo';
import { ServiceService } from '../services/service-service';

const groomerRepo = new GroomerRepo();
const groomerService = new GroomerService(groomerRepo);
const serviceRepo = new ServiceRepo();
const serviceService = new ServiceService(serviceRepo);

export default {
    groomerService,
    serviceService
}   