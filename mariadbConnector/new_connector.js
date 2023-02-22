const mariadb = require('mariadb');
const express = require('express');
require('dotenv').config();

const pool = mariadb.createPool({
    host: "129.158.58.83",
    port: 3306,
    user: "CSE3901Team5",
    password: process.env.DB_PASSWORD,
    database: "CSE3901Lab1",
    connectionLimit: 5,
});

const app = express();
const port = 3000;

app.get('/v1/users', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT user_name, highest_score, path_to_avatar FROM CSE3901Lab1.users");
        conn.release();
        res.send(JSON.stringify(rows));
    } catch (err) {
        console.error(err);
        res.status(500).send("Bad request when retrieving all users.");
    }
});

app.get('/v1/user/:user_name', async (req, res) => {
    const userName = req.params.user_name;
    try {
        const conn = await pool.getConnection();
        const row = await conn.query("SELECT * FROM CSE3901Lab1.users WHERE user_name = ?", [userName]);
        conn.release();
        res.send(JSON.stringify(row));
    } catch (err) {
        console.error(err);
        res.status(500).send("Bad request when retrieving by user name.");
    }
});

app.post("/v1/user/:user_name/:highest_score/:path_to_avatar", async (req, res) => {
    const newUser = [req.params.user_name, req.params.highest_score, req.params.path_to_avatar];
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT user_name, highest_score, path_to_avatar FROM CSE3901Lab1.users WHERE user_name = ?", [newUser[0]]);
        if (rows.length > 0) {
            throw "user repeated";
        }
        const result = await conn.query("INSERT INTO CSE3901Lab1.users(user_name, highest_score, path_to_avatar) VALUES(?, ?, ?)", newUser);
        conn.release();
        res.send("This is a post request to add a new user: " + newUser);
    } catch (err) {
        console.error(err);
        if (err === "user repeated") {
            res.status(500).send("User name already exists.");
        } else {
            res.status(500).send("Bad request when adding new users.");
        }
    }
});

app.put("/v1/user/:user_name/:highest_score", async (req, res) => {
    const userWithNewScore = [req.params.highest_score, req.params.user_name];
    try {
        const conn = await pool.getConnection();
        const result = await conn.query("UPDATE CSE3901Lab1.users SET highest_score = ? WHERE user_name = ?", userWithNewScore);
        conn.release();
        res.send("This is a put request to update a user's highest score: " + userWithNewScore);
    } catch (err) {
        console.error(err);
        res.status(500).send("Bad request when updating highest score.");
    }
});

app.delete("/v1/user/:user_name", async (req, res) => {
    const userToDelete = req.params.user_name;
    try {
        const conn = await pool.getConnection();
    //DELETE FROM users WHERE user_name = 'example_username';
        const result = await conn.query("DELETE FROM CSE3901Lab1.users WHERE user_name = ?", [userToDelete]);
        conn.release();
        res.send("This is a delete request to delete a user by user name: " + userToDelete);
    } catch (err) {
        console.error(err);
        res.status(500).send("Bad request when deleting a user.");
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});