const express = require('express');
const bodyParser = require('body-parser');
const minify = require('express-minify');
const mysql = require('mysql');
const hash = require('password-hash');
const cors = require('cors')

const app = express();
app.use(minify());
app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
  host     : 'us-cdbr-sl-dfw-01.cleardb.net',
  user     : 'bdff77578ec96c',
  password : '715adddc',
  database: 'ibmx_335912eab7de8c3'
});

connection.connect((err) => {
    if (err) {
        console.log("Failed to connect to database");
    } else {
        console.log("========= Connected to database ==========");
    }
});
app.get('/', (req, res) => {
    return res.send({"moviesdb" : "Movies backend."});
});

app.post('/api/user/subscribe', (req, res) => {
    const { username, password, email } = req.body;

    if (!username || username.length <= 3 || !password || password.length <= 3 || !email || email.length < 4) {
        return res.status(400).send("The username, password or email are not valid: not null and length > 3")
    }
    const values = { username: username, password: hash.generate(password), email: email } ;

    connection.query("INSERT INTO `user` SET ?" , values, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.sendStatus(200);
    });
    
});

app.post('/api/user/connect', (req, res) => {
    const { username, password } = req.body;

    if (!username || username.length <= 3 || !password || password.length <= 3) {
        return res.status(400).send("The username and password are not valid: not null and length > 3")
    }

    let sql = "SELECT * FROM ?? WHERE ?? = ?";
    const values = ['user', 'username', username];
    sql = mysql.format(sql, values);
    connection.query(sql, (error, results, fields) => {
        if (error) {
            return res.sendStatus(500).send(err);
        }
        if (results.length < 1) {
            return res.sendStatus(404);
        }
        if (hash.verify(password, results[0].password)) {
            return res.status(200).send({ userId : results[0].id, username : results[0].username });
        } else {
            return res.sendStatus(403);
        }
    });
});

app.post('/api/favorite', (req, res) => {
    const { userId, videoId, videoType } = req.body;

    if (!userId || !videoId || videoType.length < 4) {
        return res.status(400).send("The userId or the videoId are not valid")
    }
    const values = { videoId: videoId, userId: userId, videoType: videoType };

    connection.query("INSERT INTO `favorite` SET ?" , values, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.sendStatus(200);
    });
    
});

app.delete('/api/favorite', (req, res) => {
    const { userId, videoId, videoType } = req.body;

    if (!userId || !videoId || !videoType || videoType.length < 4) {
        return res.status(400).send("The userId or the videoId are not valid")
    }

    connection.query("DELETE FROM `favorite` WHERE `videoId`=? AND `userId`=? AND `videoType`=?",
        [videoId, userId, videoType], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.sendStatus(200);
    });
});

app.get('/api/favorite/:userId', (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).send("The userId or the videoId are not valid")
    }

    let sql = "SELECT videoId, videoType FROM ?? WHERE ?? = ?";
    const values = ['favorite', 'userId', userId];
    sql = mysql.format(sql, values);
    connection.query(sql, (error, results, fields) => {
        if (error) {
            return res.sendStatus(500).send(err);
        }
        let videos = []
        if (results.length < 1) {
            return res.send(videos);
        }
        results.forEach((element) => {
            videos.push({ videoId: element.videoId, videoType: element.videoType });
        }, this);
        return res.status(200).send(videos);
    });
});

// start the server
app.listen(process.env.PORT || 6789, () => {
    console.log('Server listening on port 6789!');
});

process.on( 'SIGINT', () => {
  console.log( "\n========== Stop database connection ==========");
  connection.end();
  process.exit();
})