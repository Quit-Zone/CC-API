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

        // Create default activity if not exists
        // const activityCheckSql = `SELECT * FROM activity WHERE user_id = ?`;
        // const [activityRows] = await pool.execute(activityCheckSql, [user.id]);

        // if (activityRows.length === 0) {
        //     const activityId = crypto.randomUUID();
        //     const insertActivitySql = `
        //         INSERT INTO activity (activity_id, user_id, task_1, task_2, task_3, task_4, status)
        //         VALUES (?, ?, ?, ?, ?, ?, ?)
        //     `;
        //     await pool.execute(insertActivitySql, [activityId, user.id, false, false, false, false, false]);
        // }

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
    const { age, gender, hobby_1, hobby_2, hobby_3, location, smokingHabit, physicalActivity, alcoholConsumption } = request.payload;

    if (!age || !gender || !hobby_1 || !hobby_2 || !hobby_3 || !location || !smokingHabit || !physicalActivity || !alcoholConsumption) {
        return h.response({ message: 'All fields are required.' }).code(400);
    }

    const genderBoolean = gender === 'male' ? 1 : gender === 'female' ? 0 : null;
    const smokingBoolean = smokingHabit === 'sering' ? 1 : smokingHabit === 'jarang'|| 'tidak pernah' ? 0 : null;
    const activityBoolean = physicalActivity === 'sering' ? 1 : physicalActivity === 'jarang'|| 'tidak pernah' ? 0 : null;
    const alcoholBoolean = alcoholConsumption === 'sering' ? 1 : alcoholConsumption === 'jarang'|| 'tidak pernah' ? 0 : null;

    try {
        const profileId = crypto.randomUUID();
        const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        const userId = request.user.id;


        const sql = `
            INSERT INTO profiles (profile_id, user_id, age, gender, smoking_habit, physical_activity, alcohol_consumption, created_at, hobby_1, hobby_2, hobby_3, location)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [profileId, userId, age, genderBoolean, smokingBoolean, activityBoolean, alcoholBoolean, createdAt, hobby_1, hobby_2, hobby_3, location];

        const [result] = await pool.execute(sql, values);

        if (result.affectedRows === 1) {
            const response = h.response({
                status: 'success',
                message: 'Profile created',
                data: {
                    profileId,
                    userId,
                    age,
                    gender: genderBoolean,
                    smokingHabit : smokingBoolean,
                    physicalActivity : activityBoolean,
                    alcoholConsumption : alcoholBoolean,
                    createdAt,
                    hobby_1,
                    hobby_2,
                    hobby_3,
                    location,
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

// async function getAndupdateActivity(request, h) {
//     const userId = request.user.id;
//     const { task_1, task_2, task_3, task_4 } = request.payload;

//     try {
//         // Update activity if payload contains any task
//         if (task_1 !== undefined || task_2 !== undefined || task_3 !== undefined || task_4 !== undefined) {
//             const updateSql = `
//                 UPDATE activity
//                 SET task_1 = COALESCE(?, task_1), 
//                     task_2 = COALESCE(?, task_2), 
//                     task_3 = COALESCE(?, task_3), 
//                     task_4 = COALESCE(?, task_4)
//                 WHERE user_id = ?
//             `;
//             const values = [task_1, task_2, task_3, task_4, userId];
//             await pool.execute(updateSql, values);
//         }

//         // Fetch the updated activity
//         const fetchSql = `
//             SELECT activity_id, user_id, task_1, task_2, task_3, task_4
//             FROM activity
//             WHERE user_id = ?
//         `;
//         const [rows] = await pool.execute(fetchSql, [userId]);

//         if (rows.length === 0) {
//             return h.response({ message: 'No activity found for the user' }).code(404);
//         }

//         const activity = rows[0];

//         // Calculate the status based on tasks
//         const tasks = [activity.task_1, activity.task_2, activity.task_3, activity.task_4];
//         const completedTasksCount = tasks.filter(task => task).length;
//         const status = completedTasksCount >= 3;

//         // Update the status in the database
//         const updateStatusSql = `
//             UPDATE activity
//             SET status = ?
//             WHERE user_id = ?
//         `;
//         await pool.execute(updateStatusSql, [status, userId]);

//         // Fetch the updated activity with the new status
//         const fetchUpdatedSql = `
//             SELECT activity_id, user_id, task_1, task_2, task_3, task_4, status
//             FROM activity
//             WHERE user_id = ?
//         `;
//         const [updatedRows] = await pool.execute(fetchUpdatedSql, [userId]);

//         const response = h.response({
//             status: 'success',
//             data: updatedRows[0]
//         });
//         response.code(200);
//         return response;

//     } catch (err) {
//         console.error(err);
//         return h.response({ message: 'Internal Server Error' }).code(500);
//     }
// }
// async function getDaily(request, h) {
//     const userId = request.user.id;
//     try {
//         // Fetch activity status from the database
//         const fetchStatusSql = `
//             SELECT status
//             FROM activity
//             WHERE user_id = ?
//         `;
//         const [rows] = await pool.execute(fetchStatusSql, [userId]);

//         if (rows.length === 0) {
//             return h.response({ message: 'No activity found for the user' }).code(404);
//         }

//         const activity = rows[0];

//         // Extract the status from the fetched activity
//         const status = activity.status;

//         return h.response({
//             status: 'success',
//             data: { status }
//         }).code(200);

//     } catch (err) {
//         console.error(err);
//         return h.response({ message: 'Internal Server Error' }).code(500);
//     }
// }
async function postPrediction(request, h) {

}

async function getPrediction(request, h) {

}

module.exports = {
    createUser,
    loginUser,
    createProfile,
    // getAndupdateActivity,
    // getDaily,
    postWallet,
    getWallet,
    postPrediction,
    getPrediction
};