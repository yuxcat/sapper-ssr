const functions = require('firebase-functions')
const express = require('express')
const compression = require('compression')
const { server } = require('./__sapper__/build/server/server')

const app = express().use(compression({ threshold: 0 }), server.middleware())

exports.ssr = functions.https.onRequest((req, res) => {
  req.baseUrl = ''
  app(req, res)
})