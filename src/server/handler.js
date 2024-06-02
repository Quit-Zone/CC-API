const pool = require("../services/db");
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');

async function createUser(request, h) {
    const { email, password, username } = request.payload;

    if (!email || !password || !username) {
        return h.response({ message: 'Email, password, and username are required.' }).code(400);
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdAt = moment().format('YYYY-MM-DD HH:mm:ss')
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
    const { age, gender, smokingHabit, physicalActivity, alcoholConsumption } = request.payload;

    if (!age || !gender || smokingHabit === undefined || !physicalActivity || alcoholConsumption === undefined) {
        return h.response({ message: 'All fields are required.' }).code(400);
    }

    try {
        const profileId = crypto.randomUUID();
        const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        const userId = request.user.id;

        const sql = `
            INSERT INTO profiles (profile_id, user_id, age, gender, smoking_habit, physical_activity, alcohol_consumption, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [profileId, userId, age, gender, smokingHabit, physicalActivity, alcoholConsumption, createdAt];

        const [result] = await pool.execute(sql, values);

        if (result.affectedRows === 1) {
            const response = h.response({
                status: 'success',
                message: 'Profile created',
                data: {
                    profileId,
                    userId,
                    age,
                    gender,
                    smokingHabit,
                    physicalActivity,
                    alcoholConsumption,
                    createdAt,
                },
            });
            response.code(201);
            return response;
        } else {
            return h.response({ message: 'Failed to create profile' }).code(500);
        }
    } catch (err) {
        console.error(err);
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

async function updateActivity(request, h) {

}
async function getActivity(request, h) {

}
async function updateDaily(request, h) {

}
async function getDaily(request, h) {

}

async function getPrediction(request, h) {

}

module.exports = {
    createUser,
    loginUser,
    createProfile,
    updateActivity,
    getActivity,
    updateDaily,
    getDaily,
    postWallet,
    getWallet,
    getPrediction
};
