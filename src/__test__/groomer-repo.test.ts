import { GroomerRepo } from '../repos/groomer-repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import { Groomer } from '../models/groomer';

/*
    We need to mock the connectionPool exported from the main module
    of our application. At this time, we only use one exposed method
    of the pg Pool API: connect. So we will provide a mock function 
    in its place so that we can mock it in our tests.
*/
jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    }
});

// The result-set-mapper module also needs to be mocked
jest.mock('../util/result-set-mapper', () => {
    return {
        mapGroomerResultSet: jest.fn()
    }
});

describe('groomerRepo', () => {

    let sut = new GroomerRepo();
    let mockConnect = mockIndex.connectionPool.connect;

    beforeEach(() => {

        /*
            We can provide a successful retrieval as the default mock implementation
            since it is very verbose. We can provide alternative implementations for
            the query and release methods in specific tests if needed.
        */
        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                id: 1,
                                username: 'kreese',
                                password: 'password',
                                first_name: 'Kaneihsa',
                                last_name: 'Reese'
                            }
                        ]
                    }
                }), 
                release: jest.fn()
            }
        });
        (mockMapper.mapGroomerResultSet as jest.Mock).mockClear();
    });

    test('should resolve to an array of groomers when getAll retrieves records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();

        let mockGroomer = new Groomer(1, 'un', 'pw', 'fn', 'ln', 0, 0);
        (mockMapper.mapGroomerResultSet as jest.Mock).mockReturnValue(mockGroomer);

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(1);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to an empty array when getAll retrieves no records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] } }), 
                release: jest.fn()
            }
        });

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(0);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to a groomer object when getById retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockGroomer = new Groomer(1, 'un', 'pw', 'fn', 'ln', 0, 0);
        (mockMapper.mapGroomerResultSet as jest.Mock).mockReturnValue(mockGroomer);

        // Act
        let result = await sut.getById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Groomer).toBe(true);

    });

    test('should resolve to a groomer object when save adds a record to the data source', async ()=>{

        //Arrange
        expect.hasAssertions();

        let mockGroomer = new Groomer(1, 'un', 'pw', 'fn', 'ln', 0, 0);
        (mockMapper.mapGroomerResultSet as jest.Mock).mockReturnValue(mockGroomer);
        //Act

        let result = await sut.save(mockGroomer);

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof Groomer).toBe(true);
    });

    test('should resolve to a boolean when update adds a record to the data source', async ()=>{

        //Arrange
        expect.hasAssertions();

        let mockGroomer = new Groomer(1, 'un', 'pw', 'fn', 'ln', 0, 0);
        (mockMapper.mapGroomerResultSet as jest.Mock).mockReturnValue(mockGroomer);
        //Act

        let result = await sut.update(mockGroomer);

        //Assert
        expect(result).toBeTruthy();
        expect(result).toBe(true);
    });

    test('should resolve to a boolean when delete removes a record to the data source', async ()=>{

        //Arrange
        expect.hasAssertions();

        let mockGroomer = new Groomer(1, 'un', 'pw', 'fn', 'ln', 0, 0);
        (mockMapper.mapGroomerResultSet as jest.Mock).mockReturnValue(mockGroomer);
        //Act

        let result = await sut.deleteById(mockGroomer.id);

        //Assert
        expect(result).toBeTruthy();
        expect(result).toBe(true);
    });

    test('should resolve to a groomer object when getGroomerByUniqueKey fetches a record from the data source', async ()=>{

        //Arrange
        expect.hasAssertions();

        let mockGroomer = new Groomer(1, 'un', 'pw', 'fn', 'ln', 0, 0);
        (mockMapper.mapGroomerResultSet as jest.Mock).mockReturnValue(mockGroomer);
        let keys = Object.keys(mockGroomer);
        let values = Object.values(mockGroomer);
        //Act

        let result = await sut.getGroomerByUniqueKey(keys[0],values[0]);

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof Groomer).toBe(true);
    });

});
