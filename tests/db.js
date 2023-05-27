const {MongoMemoryServer} = require("mongodb-memory-server")
const mongoose = require("mongoose")

let mongod;
exports.connect = async () => {
    if(!mongod){
        mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri()
        const mongooseOpt = {
            useUnifiedTopology: true,
            maxPoolSize : 10
        }
        mongoose.connect(uri, mongooseOpt)
    }
}

exports.closDatabase = async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    if(mongod) await mongod.stop()
}

exports.clearDatabase = async () => {
    const collections = await mongoose.connection.collections
    for(const key in collections){
        const collection = collections[key]
        await collection.deleteMany()
    }
}