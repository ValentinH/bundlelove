const AWS = require('aws-sdk')

const dynamoDb = new AWS.DynamoDB.DocumentClient()

const storeStat = async stat => {
  if (process.env.DISABLE_CACHE) {
    return
  }
  const params = {
    TableName: process.env.tableName,
    Item: {
      ...stat,
      createdAt: Date.now(),
    },
  }
  const data = await dynamoDb.put(params).promise()
}

const retrieveStat = async (name, version) => {
  if (process.env.DISABLE_CACHE) {
    return null
  }
  const params = {
    TableName: process.env.tableName,
    Key: {
      name,
      version,
    },
  }
  const result = await dynamoDb.get(params).promise()
  return result.Item || null
}

module.exports = { storeStat, retrieveStat }
