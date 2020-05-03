import { GroomerSchema } from './schemas';
import { Groomer } from '../models/groomer';

export function mapGroomerResultSet(resultSet: GroomerSchema): Groomer {
    
    if (!resultSet){
        return {} as Groomer;
    }

    return new Groomer(
        resultSet.id,
        resultSet.username,
        resultSet.password,
        resultSet.firstName,
        resultSet.lastName,
        resultSet.hoursWorked,
        resultSet.earnings,
        resultSet.role
    )
}