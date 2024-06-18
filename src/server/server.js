const Hapi = require('@hapi/hapi');
const routes = require('./routes.js');
require('dotenv').config();
const HapiCookie = require('@hapi/cookie');

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

  await server.register(HapiCookie);

  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'session',
      password: 'anjasdasssssssssssssssssssssssssssssssdasdsadsadsaasdsadsaaaaaaaaaaaaaaaaaaaaaa', // Use a strong password for cookie encryption
      isSecure: false, // Set to true in production
    },
    redirectTo: false,
  });

  server.auth.default('session');
  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();