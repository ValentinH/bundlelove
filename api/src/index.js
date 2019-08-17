const serverless = require('serverless-http')
const express = require('express')
const winston = require('winston')
const analyser = require('./package-analyser')

const app = express()

winston.add(new winston.transports.Console())

// CORS middleware
app.use(function(req, res, next) {
  if (process.env.IS_OFFLINE) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  } else {
    const origin = req.headers.origin
    if (origin && origin.startsWith('https://bundlelove')) {
      res.setHeader('Access-Control-Allow-Origin', origin)
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      next()
    } else {
      return res.status(403).json({
        status: 403,
        message: 'This API is only for BundleLove',
      })
    }
  }
})

app.get('/stats', async (req, res) => {
  try {
    const results = await analyser.getPackageStat(req.query.name, req.query.version)
    if (results) {
      res.json(results)
    } else {
      res.sendStatus(404)
    }
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

app.get('/history', async (req, res) => {
  try {
    const results = await analyser.getPackageStatHistory(req.query.name)

    if (!results) {
      return res.sendStatus(404)
    }
    return res.json(results)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

app.use((err, req, res, next) => {
  winston.error(error)
  if (res.headersSent) {
    return next(err)
  }
  res.sendStatus(500)
})

module.exports.app = app

module.exports.handler = serverless(app)
