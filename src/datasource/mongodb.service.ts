import { Model } from "mongoose"

abstract class IGenericRepository<T> {
    abstract add(data : Partial<T>) : Promise<T>
}

class MongoGenericRepository<T> implements IGenericRepository<T> {
    private readonly model : Model<T>
    constructor(model : Model<T>){
        this.model = model
    }
    add(data : Partial<T>) : Promise<T> {
        return this.model.create(data)
    }
}