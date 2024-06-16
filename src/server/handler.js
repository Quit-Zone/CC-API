const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const axios = require('axios');
require('dotenv').config();

const createUnixSocketPool = async config => {
    return mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        socketPath: process.env.INSTANCE_UNIX_SOCKET,
    });
};

let pool;
(async () => {
    pool = await createUnixSocketPool();
})();


async function createUser(request, h) {
    const { email, password, username } = request.payload;

    if (!email || !password || !username) {
        return h.response({ message: 'Email, password, and username are required.' }).code(400);
    }

    try {
        // Check if the email already exists
        const emailCheckSql = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
        const [emailCheckResult] = await pool.execute(emailCheckSql, [email]);
        const emailCount = emailCheckResult[0].count;

        if (emailCount > 0) {
            return h.response({ message: 'Email already in use.' }).code(409);
        }

        // Proceed with creating the user
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        const id = crypto.randomUUID();

        const sql = `
            INSERT INTO users (id, email, password, username, created_at) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [id, email, hashedPassword, username, createdAt];

        const [result] = await pool.execute(sql, values);

        if (result.affectedRows === 1) {
            const response = h.response({
                status: 'success',
                message: 'Data saved',
                data: {
                    id,
                    email,
                    username,
                    createdAt,
                },
            });
            response.code(201);
            return response;
        } else {
            // Handle the case where the insertion was not successful
            return h.response({ message: 'Failed to save data' }).code(500);
        }
    } catch (err) {
        console.error(err);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
}


async function loginUser(request, h) {
    const { email, password } = request.payload;

    if (!email || !password) {
        return h.response({ message: 'Email and password are required.' }).code(400);
    }

    try {
        const sql = `
            SELECT id, email, password, username, created_at
            FROM users
            WHERE email = ?
        `;
        const [rows] = await pool.execute(sql, [email]);

        if (rows.length === 0) {
            return h.response({ message: 'Invalid email or password' }).code(401);
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return h.response({ message: 'Invalid email or password' }).code(401);
        }

        const token = jwt.sign({ id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' });

        const response = h.response({
            status: 'success',
            message: 'Login successful',
            token: token,
            data: {
                id: user.id,
                email: user.email,
                username: user.username,
                createdAt: user.created_at,
            },
        });
        response.code(200);
        return response;

    } catch (err) {
        console.error(err);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
}

async function createProfile(request, h) {
    const { age, gender, hobby_1, hobby_2, hobby_3, height, weight, smokingHabit, physicalActivity, alcoholConsumption } = request.payload;

    if (!age || !gender || !hobby_1 || !hobby_2 || !hobby_3 || !height || !weight || !smokingHabit || !physicalActivity || !alcoholConsumption) {
        return h.response({ message: 'All fields are required.' }).code(400);
    }

    const genderBoolean = gender === 'Male' ? 1 : gender === 'Female' ? 0 : null;
    const smokingInteger = {
        'Never': 1,
        'Occasionally': 2,
        'Frequently': 3,
        'Daily': 4,
        'More than once a day': 5
    }[smokingHabit] || null;

    const activityInteger = {
        'Sedentary (little or no exercise)': 1,
        'Lightly active (light exercise/sports 1-3 days/week)': 2,
        'Moderately active (moderate exercise/sports 3-5 days/week)': 3,
        'Very active (hard exercise/sports 6-7 days a week)': 4,
        'Super active (very hard exercise/sports, physical job or training twice a day)': 5
    }[physicalActivity] || null;

    const alcoholInteger = {
        'Never': 1,
        'Occasionally': 2,
        'Frequently': 3,
        'Daily': 4,
        'More than once a day': 5
    }[alcoholConsumption] || null;

    const hobbyInteger = {
        'Running/Jogging': 1,
        'Badminton': 2,
        'Swimming': 3,
        'Cycling': 4,
        'Fitness/Exercise': 5,
        'Gardening': 6,
        'Cooking/Baking': 7,
        'Writing': 8,
        'Playing Cards/Board Games': 9,
        'Reading Books': 10,
        'Fishing': 11,
        'Yoga/Meditation': 12,
        'Traveling': 13,
        'Video Gaming': 14,
        'Volunteering': 15
    };

    const hobby_1_integer = hobbyInteger[hobby_1] || null;
    const hobby_2_integer = hobbyInteger[hobby_2] || null;
    const hobby_3_integer = hobbyInteger[hobby_3] || null;

    if (genderBoolean === null || smokingInteger === null || activityInteger === null || alcoholInteger === null || hobby_1_integer === null || hobby_2_integer === null || hobby_3_integer === null) {
        return h.response({ message: 'Invalid input values.' }).code(400);
    }

    try {
        const profileId = crypto.randomUUID();
        const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        const userId = request.user.id;

        const sql = `
            INSERT INTO profiles (profile_id, user_id, age, gender, smoking_habit, physical_activity, alcohol_consumption, created_at, hobby_1, hobby_2, hobby_3, height, weight)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [profileId, userId, age, genderBoolean, smokingInteger, activityInteger, alcoholInteger, createdAt, hobby_1_integer, hobby_2_integer, hobby_3_integer, height, weight];

        const [result] = await pool.execute(sql, values);

        if (result.affectedRows === 1) {
            return h.response({
                status: 'success',
                message: 'Profile created',
                data: {
                    profileId,
                    userId,
                    age,
                    gender: genderBoolean,
                    smokingHabit: smokingInteger,
                    physicalActivity: activityInteger,
                    alcoholConsumption: alcoholInteger,
                    createdAt,
                    hobby_1: hobby_1_integer,
                    hobby_2: hobby_2_integer,
                    hobby_3: hobby_3_integer,
                    height,
                    weight,
                },
            }).code(201);
        } else {
            return h.response({ message: 'Failed to create profile' }).code(500);
        }
    } catch (err) {
        console.error('Error creating profile:', err);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
}


async function postWallet(request, h) {
    const { amount } = request.payload;

    if (amount === undefined) {
        return h.response({ message: 'Amount is required.' }).code(400);
    }

    try {
        const walletId = crypto.randomUUID();
        const userId = request.user.id; // Mendapatkan user_id dari token JWT

        const sql = `
            INSERT INTO wallet (wallet_id, user_id, amount) 
            VALUES (?, ?, ?)
        `;
        const values = [walletId, userId, amount];

        const [result] = await pool.execute(sql, values);

        if (result.affectedRows === 1) {
            const response = h.response({
                status: 'success',
                message: 'Wallet created successfully',
                data: {
                    walletId,
                    userId,
                    amount,
                },
            });
            response.code(201);
            return response;
        } else {
            return h.response({ message: 'Failed to create wallet' }).code(500);
        }
    } catch (err) {
        console.error(err);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
}
async function getWallet(request, h) {
    try {
        const userId = request.user.id; // Mendapatkan user_id dari token JWT

        const sql = `
            SELECT * FROM wallet WHERE user_id = ?
        `;
        const [rows] = await pool.execute(sql, [userId]);

        if (rows.length === 0) {
            return h.response({ message: 'No wallet found for this user' }).code(404);
        }

        const response = h.response({
            status: 'success',
            data: rows,
        });
        response.code(200);
        return response;
    } catch (err) {
        console.error(err);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
}

async function postPrediction(request, h) {
    const userId = request.user.id;

    try {
        // Fetch profile data
        const sqlProfile = 'SELECT * FROM profiles WHERE user_id = ?';
        const [profileRows] = await pool.execute(sqlProfile, [userId]);

        if (profileRows.length === 0) {
            return h.response({ message: 'Profile not found' }).code(404);
        }

        const profile = profileRows[0];

        // Data for prediction
        const prediction_data = {
            age: profile.age,
            alcoholConsumption: profile.alcohol_consumption,
            gender: profile.gender,
            height: profile.height,
            hobby_1: profile.hobby_1,
            hobby_2: profile.hobby_2,
            hobby_3: profile.hobby_3,
            physicalActivity: profile.physical_activity,
            smokingHabit: profile.smoking_habit,
            weight: profile.weight
        };

        // Send prediction data to FastAPI service
        const mlResponse = await axios.post('https://quitzone-ml-agkhzirw6a-et.a.run.app/predict', prediction_data);

        // Handle prediction response
        const predictionResult = mlResponse.data.prediction_result;

        // Save prediction result to database
        const predictId = crypto.randomUUID();
        const sqlPredict = `
            INSERT INTO predict (predict_id, user_id, prediksi_kategori)
            VALUES (?, ?, ?)
        `;
        const valuesPredict = [predictId, userId, predictionResult];

        const [resultPredict] = await pool.execute(sqlPredict, valuesPredict);

        if (resultPredict.affectedRows === 1) {
            return h.response({
                status: 'success',
                message: 'Prediction created',
                data: {
                    predictId,
                    userId,
                    kategori: predictionResult
                },
            }).code(201);
        } else {
            return h.response({ message: 'Failed to create prediction' }).code(500);
        }
    } catch (err) {
        console.error('Error creating prediction:', err); // Detailed error logging
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
}


async function getPrediction(request, h) {
    const { predictId } = request.params;

    try {
        // Ambil kolom result_cluster berdasarkan predictId
        const sql = 'SELECT prediksi_kategori FROM predict WHERE predict_id = ?';
        const [rows] = await pool.execute(sql, [predictId]);

        if (rows.length === 0) {
            return h.response({ message: 'Prediction not found' }).code(404);
        }

        const resultCluster = rows[0].result_cluster;

        return h.response({
            status: 'success',
            data: {
                resultCluster: resultCluster,
            },
        }).code(200);
    } catch (err) {
        console.error('Error retrieving prediction:', err);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
}

module.exports = {
    createUser,
    loginUser,
    createProfile,
    postWallet,
    getWallet,
    postPrediction,
    getPrediction
};
