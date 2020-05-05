export interface CrudRepo<T> {
    getAll(): Promise<T[]>;
    getById(id:number): Promise<T>;
    save(newObj: T): Promise<T>;
    update(updateObj: T): Promise<Boolean>;
    deleteById(id:number): Promise<boolean>;
}