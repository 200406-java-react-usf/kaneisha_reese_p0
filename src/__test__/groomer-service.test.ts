import { GroomerService } from '../services/groomer-service';
import { GroomerRepo } from '../repos/groomer-repo';
import { Groomer } from '../models/groomer';
import Validator from '../util/validator';
import { ResourceNotFoundError, BadRequestError, ResourcePersistenceError } from '../errors/errors';
import e from 'express';
import validator from '../util/validator';

jest.mock('../repos/groomer-repo', () => {
    
    return new class GroomerRepo {
            getAll = jest.fn();
            getById = jest.fn();
            save = jest.fn();
            update = jest.fn();
            deleteById = jest.fn();
            getGroomerByUniqueKey = jest.fn();
                
    }

});
describe('groomerService', () => {

    let sut: GroomerService;
    let mockRepo;

    let mockGroomers = [
        new Groomer(1, 'aanderson', 'password', 'Alice', 'Anderson', 0, 0),
        new Groomer(2, 'bbailey', 'password', 'Bob', 'Bailey', 0, 0),
        new Groomer(3, 'ccountryman', 'password', 'Charlie', 'Countryman', 0, 0),
        new Groomer(4, 'ddavis', 'password', 'Daniel', 'Davis', 0, 0),
        new Groomer(5, 'eeinstein', 'password', 'Emily', 'Einstein', 0, 0)
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
        sut = new GroomerService(mockRepo);
    
    });

    test('should resolve to Groomer[] (without passwords) when getAllGroomers() successfully retrieves groomers from the data source', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockGroomers);

        // Act
        let result = await sut.getAllGroomers();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(5);
        result.forEach(val => expect(val.password).toBeUndefined());

    });

    test('should reject with ResourceNotFoundError when getAllGroomers fails to get any users from the data source', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.assertions(1);
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        // Act
        try {
            await sut.getAllGroomers();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to Groomer when getUserById is given a valid an known id', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.assertions(3);
        
        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Groomer>((resolve) => resolve(mockGroomers[id - 1]));
        });


        // Act
        let result = await sut.getGroomerById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.groomer_id).toBe(1);
        expect(result.password).toBeUndefined();

    });

    test('should reject with BadRequestError when getGroomerById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getGroomerById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getGroomerById is given a invalid value as an id (zero)', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getGroomerById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getGroomerById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getGroomerById(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getGroomerById is given a invalid value as an id (negative)', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getGroomerById(-2);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError if getGroomerById is given an unknown id', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getGroomerById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to Groomer when getGroomerByUniqueKey is given a valid key, value pair', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.assertions(3);
        
        Validator.isPropertyOf = jest.fn().mockReturnValue(true);

        mockRepo.getGroomerByUniqueKey = jest.fn().mockImplementation((queryObj: any) => {
            return new Promise<Groomer>((resolve) => resolve(mockGroomers[0]));
        });


        // Act
        let result = await sut.getGroomerByUniqueKey({'username': 'aanderson'});

        // Assert
        expect(result).toBeTruthy();
        expect(result.groomer_id).toBe(1);
        expect(result.password).toBeUndefined();

    });

    // test('should resolve to Groomer when getGroomerByUniqueKey is given a valid id, value pair', async () => {

    //     // Arrange
    //     jest.clearAllMocks();
    //     expect.assertions(3);
        
    //     Validator.isPropertyOf = jest.fn().mockReturnValue(true);

    //     mockRepo.getGroomerById = jest.fn().mockResolvedValue(mockGroomers[0]);
        
    //     // Act
    //     let result = await sut.getGroomerByUniqueKey({'id': '1'});

    //     // Assert
    //     expect(result).toBeTruthy();
    //     expect(result.groomer_id).toBe(1);
    //     expect(result.password).toBeUndefined();

    // });


    test('should reject with BadRequestError if getGroomerByUniqueKey is given a key that is not a property of Groomer', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getGroomerByUniqueKey = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getGroomerByUniqueKey({'person': 'aanderson'});
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError if getGroomerByUniqueKey is given a key that is not a property of Groomer', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getGroomerByUniqueKey = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getGroomerByUniqueKey({'id': 'aanderson'});
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError if getGroomerByUniqueKey is given an invalid value type', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getGroomerByUniqueKey = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getGroomerByUniqueKey({'username': 2});
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError if getGroomerByUniqueKey is given an invalid key, value pair', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getGroomerByUniqueKey = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getGroomerByUniqueKey({'username': 'aanderson1'});
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to Groomer when addNewGroomer is given valid groomer', async () => {

        // Arrange
        jest.clearAllMocks();
        
        let mockGroomer = new Groomer(10, 'testing', 'test', 'test', 'test', 0, 0);
    
        mockRepo.getGroomerByUniqueKey = jest.fn().mockReturnValue(true);
        mockRepo.save = jest.fn().mockReturnValue(mockGroomer);
        


        // Act
        let result = await sut.addNewGroomer(mockGroomer);

        // Assert
        expect(result).toBeTruthy();
        expect(result.groomer_id).toBe(10);
        expect(result.password).toBeUndefined();

    });
    test('should throw ResourcePersistenceError when addNewGroomer is given username already in use', async () => {

        // Arrange
        jest.clearAllMocks();
        let mockGroomer = new Groomer(10, 'testing', 'test', 'test', 'test', 0, 0);
    
        mockRepo.getGroomerByUniqueKey = jest.fn().mockResolvedValue(mockGroomer)
        mockRepo.save = jest.fn().mockReturnValue(null);
        


        // Act
        try {
            await sut.getGroomerByUniqueKey({'username': 'aanderson'});
        } catch (e) {

            // Assert
            expect(e instanceof ResourcePersistenceError).toBe(true);
        }

    });

    test('should return true when updateGroomer is given valid groomer',async () => {

        // Arrange
        jest.clearAllMocks();
        Validator.isPropertyOf = jest.fn().mockReturnValue(true);
        mockRepo.update = jest.fn().mockReturnValue(true);
        let mockGroomer = new Groomer(1, 'aanderson', 'updated', 'Alice', 'Anderson', 0, 0);


        // Act
        
        let result = await sut.updateGroomer(mockGroomer);

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