import { ServiceRepo } from '../repos/service-repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import { Service } from '../models/service';

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
        mapServiceResultSet: jest.fn()
    }
});

describe('serviceRepo', () => {

    let sut = new ServiceRepo();
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
        (mockMapper.mapServiceResultSet as jest.Mock).mockClear();
    });

    test('should resolve to an array of services when getAll retrieves records from data source', async () => {
        
        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();

        let mockService = new Service(1, 'name',[],[]);
        (mockMapper.mapServiceResultSet as jest.Mock).mockReturnValue(mockService);

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
        jest.clearAllMocks();
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

    test('should resolve to a service object when getById retrieves a record from data source', async () => {

        // Arrange
        jest.clearAllMocks();
        expect.hasAssertions();

        let mockService = new Service(1, 'name',[],[]);
        (mockMapper.mapServiceResultSet as jest.Mock).mockReturnValue(mockService);

        // Act
        let result = await sut.getById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Service).toBe(true);

    });

    test('should resolve to a service object when save adds a record to the data source', async ()=>{

        //Arrange
        jest.clearAllMocks();
        expect.hasAssertions();

        let mockService = new Service(1, 'name',[],[]);
        (mockMapper.mapServiceResultSet as jest.Mock).mockReturnValue(mockService);
        //Act

        let result = await sut.save(mockService);

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof Service).toBe(true);
    });

    test('should resolve to a boolean when update adds a record to the data source', async ()=>{

        //Arrange
        expect.hasAssertions();

        let mockService = new Service(1, 'name',[],[]);
        (mockMapper.mapServiceResultSet as jest.Mock).mockReturnValue(mockService);
        //Act

        let result = await sut.update(mockService);

        //Assert
        expect(result).toBeTruthy();
        expect(result).toBe(true);
    });

    test('should resolve to a boolean when delete removes a record to the data source', async ()=>{

        //Arrange
        expect.hasAssertions();

        let mockService = new Service(1, 'name',[],[]);
        (mockMapper.mapServiceResultSet as jest.Mock).mockReturnValue(mockService);
        //Act

        let result = await sut.deleteById(mockService.service_id);

        //Assert
        expect(result).toBeTruthy();
        expect(result).toBe(true);
    });

    

});
