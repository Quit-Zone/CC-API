const {
  createUser, 
  loginUser, 
  createProfile,
  postWallet,
  getWallet,
  postPrediction,
  getPrediction 
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
    options: {
      auth: false // Make login route accessible without authentication
    }
  },
  {
    path: "/profile",
    method: "POST",
    handler: createProfile,
    // options: {
    //   pre: [authenticateToken]
    // }
  },
  {
    path: "/wallet",
    method: "POST",
    handler: postWallet,
    // options: {
    //   pre: [authenticateToken]
    // }
  },
  {
    path: "/wallet",
    method: "GET",
    handler: getWallet,
    // options: {
    //   pre: [authenticateToken]
    // }
  },
  {
    path: "/predict",
    method: "POST",
    handler: postPrediction,
    // options: {
    //   pre: [authenticateToken]
    // }
  },
  {
    path: "/predict",
    method: "GET",
    handler: getPrediction,
    // options: {
    //   pre: [authenticateToken]
    // }
  }
];

module.exports = routes;