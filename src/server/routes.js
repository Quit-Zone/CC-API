const {
  createUser, //register
  loginUser, //login
  createProfile, // kuesioner profile
  updateActivity, //edit activity list
  getActivity, // get activity
  updateDaily, //edit daily
  getDaily, //get daily
  postWallet,
  getPrediction //prediksi penyakit
} = require('./handler');
const authenticateToken = require('../middleware/authenticateToken');

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
    options: {
      pre: [authenticateToken]
    }
  },
  {
    path: "/wallet",
    method: "POST",
    handler: postWallet,
    options: {
      pre: [authenticateToken]
    }
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
  }
];

module.exports = routes;