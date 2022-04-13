require('dotenv').config();
const mongoose = require('mongoose');

// call env vars and set up connection
password = process.env.MONGOPWDENCODED;

connStr = `mongodb+srv://WisdomggAdmin:${password}@socials.ixuqy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

// create connect function
/*
function connect(options = null) {
    mongoose.connect(connStr)
    mongoose.connection.on('error', console.error.bind(console, 'connection failed with error: \n'))
    if (options == null) {
        mongoose.connection.once('open', () => {
            console.log('connected to mongo!\n')
        })
    } else if (options == "noMsg") {
        // do nothing
    }

}
*/

const connect = async () => {
    try {
        await mongoose.connect(connStr, {
            socketTimeoutMS: 10000
        })
        console.log('mongo connected!')
        return mongoose
    } catch (error) {
        console.log(error)
    }
} 

const makeModel = (modelName, schemaJson) => {
    connect('noMsg')
    if (mongoose.models[modelName]) return mongoose.models[modelName]
    const schema = mongoose.Schema(schemaJson)
    return mongoose.model(modelName, schema)
}

module.exports = { makeModel, connect }