const tf = require('@tensorflow/tfjs-node');
const tfdf = require('@tensorflow/tfjs-tfdf');
require('dotenv').config();


class InferenceService {
    constructor() {
        this.model = null;
        this.labelNames = ["Physically active", "Creatively engaged", "Relaxed and leisurely", "Socially involved"];
    }

    async loadModel() {
        this.model = await tfdf.loadTFDFModel(process.env.MODEL_URL);
    }

    async predict(inputData) {
        if (!this.model) {
            throw new Error('Model is not loaded');
        }

        const processedInput = await this.model.executeAsync({
            "age:0": tf.tensor([inputData.age], [1], 'int32'),
            "alcohol:0": tf.tensor([inputData.alcohol], [1], 'int32'),
            "gender:0": tf.tensor([inputData.gender], [1], 'int32'),
            "height:0": tf.tensor([inputData.height], [1], 'float32'),
            "hobby_1:0": tf.tensor([inputData.hobby_1], [1], 'int32'),
            "hobby_2:0": tf.tensor([inputData.hobby_2], [1], 'int32'),
            "hobby_3:0": tf.tensor([inputData.hobby_3], [1], 'int32'),
            "location:0": tf.tensor([inputData.location], [1], 'string'),
            "physical_activity:0": tf.tensor([inputData.physical_activity], [1], 'int32'),
            "smoke:0": tf.tensor([inputData.smoke], [1], 'int32'),
            "weight:0": tf.tensor([inputData.weight], [1], 'float32')
        });

        const prediction = this.model.execute(processedInput, ['Identity:0']);
        const scores = await prediction.array();
        prediction.dispose(); // Hapus tensor dari memori setelah selesai digunakan
        const highestScoreIndex = scores[0].indexOf(Math.max(...scores[0]));
        return this.labelNames[highestScoreIndex];
    }
}

module.exports = InferenceService;