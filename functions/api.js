const serverless = require('serverless-http');
const app = require('../src/index').app;

module.exports.handler = serverless(app);