const {
  createUser, //register
  loginUser, //login
  createProfile, // kuesioner profile
  // getAndupdateActivity, //edit activity list
  // getDaily, //get daily
  postWallet,
  getWallet,
  postPrediction,
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
    path: "/wallet",
    method: "GET",
    handler: getWallet,
    options: {
      pre: [authenticateToken]
    }
  },
  // {
  //   path: "/activity",
  //   method: "PUT",
  //   handler: getAndupdateActivity,
  //   options: {
  //     pre: [authenticateToken]
  //   }
  // },
  // {
  //   path: "/status",
  //   method: "GET",
  //   handler: getDaily,
  //   options: {
  //     pre: [authenticateToken]
  //   }
  // },
  {
    path: "/predict",
    method: "POST",
    handler: postPrediction,
    options: {
      pre: [authenticateToken]
    }
  },
  {
    path: "/predict",
    method: "GET",
    handler: getPrediction,
    options: {
      pre: [authenticateToken]
    }
  }
];

module.exports = routes;