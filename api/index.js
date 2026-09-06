// Vercel Serverless Function Handler for Express API
const app = require('../server');

module.exports = (req, res) => {
  return app(req, res);
};
