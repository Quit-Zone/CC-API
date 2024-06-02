const { 
  createUser, //register
  loginUser, //login
  createProfile, // kuesioner profile
  updateActivity, //edit activity list
  getActivity, // get activity
  updateDaily, //edit daily
  getDaily, //get daily
  getPrediction //prediksi penyakit
} = require('./handler');
  
  const routes = [
    {
      path: "/register",
      method: "POST",
      handler: createUser,
    },
    {
      path: "/login",
      method: "POST",
      handler: loginUser,
    },
    {
      path: "/profile",
      method: "POST",
      handler: createProfile,
    },
    {
      path: "/updateActivity",
      method: "PUT",
      handler: updateActivity,
    },
    {
      path: "/getActivity",
      method: "GET",
      handler: getActivity,
    },
    {
      path: "/updateDaily",
      method: "PUT",
      handler: updateDaily,
    },
    {
      path: "/getDaily",
      method: "GET",
      handler: getDaily,
    },
    {
      path: "/predict",
      method: "GET",
      handler: getPrediction,
    },
  ];
  
  module.exports = routes;