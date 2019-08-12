const AWS = require('aws-sdk')

const dynamoDb = new AWS.DynamoDB.DocumentClient()

const storeStat = async stat => {
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
