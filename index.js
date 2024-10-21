const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs');

const PORT = 80;

const PSW = "Sushiroll8016!";
const KEY = 'Sushiroll8016!';

app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html');
});

app.get('/admin', (req, res) => {
    res.sendFile(join(__dirname, '/pages/admin.html'));
});

io.on('connection', (socket) => {
    socket.on('request_blogs', (id) => {
        var dirFs = fs.readdirSync('./blogs');
        var blogContents = [];
    
        for (let i = 0; i < dirFs.length; i++) {
            if (dirFs[i].substring(dirFs[i].length - 5, dirFs[i].length) == '.json') {
                fs.readFile('./blogs/' + dirFs[i], function (err, buf) {
                    var cont = buf.toString();

                    console.log(cont);
                });
            }
        }
    });
});

app.get('/blog', (req, res) => {
    res.sendFile(__dirname + '/pages/blog.html');
});

app.get('/login', (req, res) => {
    let qualified = req.query.password[1] == PSW;

    if (qualified) {
        const token = jwt.sign({ name: req.query.password[0] }, KEY, { expiresIn: 60 * 60 });
        res.cookie('token', token, {
            httpOnly: true,
        });

        return res.redirect('/');
    }
});

app.listen(PORT, () => {
    console.log('server started in port : ' + PORT);
});