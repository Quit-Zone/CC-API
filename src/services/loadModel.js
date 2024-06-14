const tf = require('@tensorflow/tfjs-node');
const tfdf = require('@tensorflow/tfjs-tfdf');
const axios = require('axios');


async function loadModel() {
    try {
        const model = await tfdf.loadTFDFModel(process.env.MODEL_URL);
      
        return model;
        
    } catch (err) {
        throw new Error(`Error loading model: ${err.message}`);
    }
}

module.exports = loadModel;
