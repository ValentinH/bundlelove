const serverless = require('serverless-http')
const express = require('express')
const analyser = require('./package-analyser')

const app = express()

const allowedOrigins = ['http://localhost:3000', 'https://valentin-hervieu.fr']

// CORS middleware
// if (!process.env.IS_OFFLINE) {
//   app.use(function(req, res, next) {
//     const origin = req.headers.origin
//     if (allowedOrigins.includes(origin)) {
//       res.setHeader('Access-Control-Allow-Origin', origin)
//       res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
//       next()
//     } else {
//       return res.status(403).json({
//         status: 403,
//         message: 'This API is only for https://valentin-hervieu.fr',
//       })
//     }
//   })
// }

app.get('/stats', async (req, res) => {
  try {
    const results = await analyser.getPackageStat(req.query.name, req.query.version)
    if (results) {
      res.json(results)
    } else {
      res.sendStatus(404)
    }
  } catch (e) {
    if (process.env.IS_OFFLINE) {
      console.error(e)
    }
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
    if (process.env.IS_OFFLINE) {
      console.error(e)
    }
    res.sendStatus(500)
  }
})

module.exports.handler = serverless(app)
