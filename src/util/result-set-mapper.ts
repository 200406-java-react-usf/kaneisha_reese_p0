import { GroomerSchema } from './schemas';
import { Groomer } from '../models/groomer';

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