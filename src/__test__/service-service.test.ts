import { ServiceService } from '../services/service-service';
import { ServiceRepo } from '../repos/service-repo';
import { Service } from '../models/service';
import Validator from '../util/validator';
import { ResourceNotFoundError, BadRequestError, ResourcePersistenceError } from '../errors/errors';
import e from 'express';
import validator from '../util/validator';

jest.mock('../repos/service-repo', () => {
    
    return new class ServiceRepo {
            getAll = jest.fn();
            getById = jest.fn();
            save = jest.fn();
            update = jest.fn();
            deleteById = jest.fn();
            
                
    }

});
describe('serviceService', () => {

    let sut: ServiceService;
    let mockRepo;

    let mockServices = [
        new Service(1, 'bath', [],[]),
        new Service(2, 'trim', [],[]),
        new Service(3,  'teeth cleaning', [],[])

    ];

    beforeEach(() => {

        mockRepo = jest.fn(() => {
            return {
                getAll: jest.fn(),
                getById: jest.fn(),
                getUserByUniqueKey: jest.fn(),
                getUserByCredentials: jest.fn(),
                save: jest.fn(),
                update: jest.fn(),
                deleteById: jest.fn()
            }
        });

        // @ts-ignore
        sut = new ServiceService(mockRepo);
    
    });

    test('should resolve to Service[]  when getAllServices() successfully retrieves services from the data source', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockServices);

        // Act
        let result = await sut.getAllServices();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(3);

    });

    test('should reject with ResourceNotFoundError when getAllServices fails to get any users from the data source', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.assertions(1);
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        // Act
        try {
            await sut.getAllServices();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to Service when getUserById is given a valid an known id', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.assertions(2);
        
        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Service>((resolve) => resolve(mockServices[id - 1]));
        });


        // Act
        let result = await sut.getServiceById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.service_id).toBe(1);
        

    });

    test('should reject with BadRequestError when getServiceById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getServiceById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getServiceById is given a invalid value as an id (zero)', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getServiceById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getServiceById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getServiceById(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getServiceById is given a invalid value as an id (negative)', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getServiceById(-2);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError if getServiceById is given an unknown id', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getServiceById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });








 

    test('should resolve to Service when addNewService is given valid service', async () => {

        // Arrange
        jest.clearAllMocks();
        
        let mockService = new Service(1, 'bath', [],[]);
    
       
        mockRepo.save = jest.fn().mockReturnValue(mockService);
        


        // Act
        let result = await sut.addNewService(mockService);

        // Assert
        expect(result).toBeTruthy();
        expect(result.service_id).toBe(1);
        

    });



    test('should return true when updateService is given valid service',async () => {

        // Arrange
        jest.clearAllMocks();
        Validator.isPropertyOf = jest.fn().mockReturnValue(true);
        mockRepo.update = jest.fn().mockReturnValue(true);
        let mockService = new Service(1, 'bath', [],[]);


        // Act
        
        let result = await sut.updateService(mockService);

        // Assert
        expect(result).toBeTruthy();
        expect(result).toBe(true);

    });

    test('should treturn true when deleteById is given valid id', async () => {

        // Arrange
        jest.clearAllMocks();
        Validator.isValidId = jest.fn().mockReturnValue(true);
        mockRepo.deleteById = jest.fn().mockReturnValue(true);
        


        // Act
        
        let result = await sut.deleteById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result).toBe(true);

    });

    test('should reject with BadRequestError if deleteById is given an invalid id', async () => {

        // Arrange
        jest.clearAllMocks();
        Validator.isValidId = jest.fn().mockReturnValue(true);
        mockRepo.deleteById = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.deleteById(1000);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });



});