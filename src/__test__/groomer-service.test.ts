import { GroomerService } from '../services/groomer-service';
import { GroomerRepo } from '../repos/groomer-repo';
import { Groomer } from '../models/groomer';
import Validator from '../util/validator';
import { ResourceNotFoundError, BadRequestError } from '../errors/errors';
import e from 'express';

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
        expect.assertions(3);
        
        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Groomer>((resolve) => resolve(mockGroomers[id - 1]));
        });


        // Act
        let result = await sut.getGroomerById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.id).toBe(1);
        expect(result.password).toBeUndefined();

    });

    test('should reject with BadRequestError when getGroomerById is given a invalid value as an id (decimal)', async () => {

        // Arrange
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
        expect.assertions(3);
        
        Validator.isPropertyOf = jest.fn().mockReturnValue(true);

        mockRepo.getGroomerByUniqueKey = jest.fn().mockImplementation((queryObj: any) => {
            return new Promise<Groomer>((resolve) => resolve(mockGroomers[0]));
        });


        // Act
        let result = await sut.getGroomerByUniqueKey({'username': 'aanderson'});

        // Assert
        expect(result).toBeTruthy();
        expect(result.id).toBe(1);
        expect(result.password).toBeUndefined();

    });

    test('should resolve to Groomer when getGroomerByUniqueKey is given a valid id, value pair', async () => {

        // Arrange
        expect.assertions(3);
        
        Validator.isPropertyOf = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Groomer>((resolve) => resolve(mockGroomers[id - 1]));
        });
        mockRepo.getGroomerByUniqueKey = jest.fn().mockImplementation((queryObj: any) => {
            return new Promise<Groomer>((resolve) => resolve(mockGroomers[0]));
        });
        


        // Act
        let result = await sut.getGroomerByUniqueKey({'id': '1'});

        // Assert
        expect(result).toBeTruthy();
        expect(result.id).toBe(1);
        expect(result.password).toBeUndefined();

    });


    test('should reject with BadRequestError if getGroomerByUniqueKey is given a key that is not a property of Groomer', async () => {

        // Arrange
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
        
        let mockGroomer = new Groomer(10, 'test', 'test', 'test', 'test', 0, 0);
        Validator.isValidObject = jest.fn().mockReturnValue(true);
        
        mockRepo.getGroomerByUniqueKey = jest.fn().mockReturnValue(new BadRequestError())
        mockRepo.save = jest.fn().mockReturnValue(mockGroomer);
        


        // Act
        let result = await sut.addNewGroomer(mockGroomer);

        // Assert
        expect(result).toBeTruthy();
        expect(result.id).toBe(1);
        expect(result.password).toBeUndefined();

    });

});