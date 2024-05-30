const {
    postPredictHandler,
    getPredictHandler,
  } = require("../server/handler");
  
  const routes = [
    {
      path: "/predict",
      method: "POST",
      handler: postPredictHandler,
      options: {
        payload: {
          allow: "multipart/form-data",
          maxBytes: 1000000,
          multipart: true,
        },
      },
    },
    {
      path: "/predict/histories",
      method: "GET",
      handler: getPredictHandler,
    },
  ];
  
  module.exports = routes;