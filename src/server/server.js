const Hapi = require('@hapi/hapi');
const routes = require('./routes.js');
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
  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();