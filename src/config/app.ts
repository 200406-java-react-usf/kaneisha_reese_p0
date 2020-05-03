import { GroomerRepo } from '../repos/groomer-repo';
import { GroomerService } from '../services/groomer-service';

const groomerRepo = new GroomerRepo();
const groomerService = new GroomerService(groomerRepo);

export default {
    groomerService
}   