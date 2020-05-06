import {
     GroomerSchema, 
    ServiceSchema
    } from './schemas';
import { Groomer } from '../models/groomer';
import { Service } from '../models/service';

export function mapGroomerResultSet(resultSet: GroomerSchema): Groomer {
    
    if (!resultSet){
        return {} as Groomer;
    }

    return new Groomer(
        resultSet.groomer_id,
        resultSet.username,
        resultSet.password,
        resultSet.first_name,
        resultSet.last_name,
        resultSet.earnings,
        resultSet.hours
    );
}
export function mapServiceResultSet(resultSet: ServiceSchema): Service {
    
    if (!resultSet){
        return {} as Service;
    }

    return new Service(      
        resultSet.service_id,
        resultSet.name,
        resultSet.costs = null,
        resultSet.hours = null,
    );
}