const Hapi = require('@hapi/hapi');
const routes = require('./routes.js');
const loadModel = require('../services/loadModel.js');
const InferenceService = require('../services/inferenceService.js');
require('dotenv').config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host:'0.0.0.0',
    routes: {
        cors: {
            origin: ['*'], //isi url frontend & ML
        },
    },
  });
  const model = await loadModel();
  const inferenceService = new InferenceService();

  await inferenceService.loadModel(process.env.MODEL_URL);

  server.app.model = model;
  server.app.inferenceService = inferenceService;
  
  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();