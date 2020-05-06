import { AnimalService } from '../services/animal-service';
import { AnimalRepo } from '../repos/animal-repo';
import { Animal } from '../models/animal';
import Validator from '../util/validator';
import { ResourceNotFoundError, BadRequestError, ResourcePersistenceError } from '../errors/errors';
import e from 'express';


jest.mock('../repos/animal-repo', () => {
    
    return new class AnimalRepo {
            getAll = jest.fn();
            getById = jest.fn();
            save = jest.fn();
            update = jest.fn();
            deleteById = jest.fn();
            
                
    }

});
describe('animalService', () => {

    let sut: AnimalService;
    let mockRepo;

    let mockAnimals = [
        new Animal(1, 'fluffy',1,12,[]),
        new Animal(2, 'mittens',1,32,[]),
        new Animal(3, 'bob',1,62,[])

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
        sut = new AnimalService(mockRepo);
    
    });

    test('should resolve to Animal[]  when getAllAnimals() successfully retrieves animals from the data source', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockAnimals);

        // Act
        let result = await sut.getAllAnimals();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(3);

    });

    test('should reject with ResourceNotFoundError when getAllAnimals fails to get any animals from the data source', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.assertions(1);
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        // Act
        try {
            await sut.getAllAnimals();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to animal when getAnimalById is given a valid an known id', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.assertions(2);
        
        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Animal>((resolve) => resolve(mockAnimals[id - 1]));
        });


        // Act
        let result = await sut.getAnimalById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.animal_id).toBe(1);
        

    });

    test('should reject with BadRequestError when getAnimalById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getAnimalById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getAnimalById is given a invalid value as an id (zero)', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getAnimalById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getAnimalById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getAnimalById(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getAnimalById is given a invalid value as an id (negative)', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getAnimalById(-2);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError if getAnimalById is given an unknown id', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getAnimalById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });








 

    test('should resolve to animal when addNewAnimal is given valid animal', async () => {

        // Arrange
        jest.clearAllMocks();
        
        let mockanimal = new Animal(10, 'name',1,12,[]);
    
       
        mockRepo.save = jest.fn().mockReturnValue(mockanimal);
        


        // Act
        let result = await sut.addNewAnimal(mockanimal);

        // Assert
        expect(result).toBeTruthy();
        expect(result.animal_id).toBe(10);
        

    });



    test('should return true when updateAnimal is given valid animal',async () => {

        // Arrange
        jest.clearAllMocks();
        Validator.isPropertyOf = jest.fn().mockReturnValue(true);
        mockRepo.update = jest.fn().mockReturnValue(true);
        let mockanimal = new Animal(1, 'name',1,12,[]);


        // Act
        
        let result = await sut.updateAnimal(mockanimal);

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