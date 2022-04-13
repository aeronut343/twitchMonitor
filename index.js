const { getList } = require("./streamUpsert")
const AWS = require('aws-sdk')
exports.handler =  async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))
    const result = await getList()
    callback(null, 'hello you sorry ape')
    return result
  }