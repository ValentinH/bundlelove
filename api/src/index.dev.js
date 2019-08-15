// this module is only for running the api without serverless
const express = require('express')

// set fake env
process.env.IS_OFFLINE = true
process.env.DISABLE_CACHE = true

const { app } = require('.')

const port = 3001

app.listen(port, () => console.log(`dev api is listening on port ${port}!`))
