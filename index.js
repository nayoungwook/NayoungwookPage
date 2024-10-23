const express = require('express');
const app = express();
const fs = require('fs');
const { join } = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const PORT = 80;

const PSW = "Sushiroll8016!";
const KEY = 'Sushiroll8016!';

app.use(express.static('.'));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html');
});

app.get('/admin', (req, res) => {
    res.sendFile(join(__dirname, '/pages/admin.html'));
});

app.get('/blogData', (req, res) => {
    let data = fs.readFileSync(__dirname + '/blogs/blogData.json', 'utf-8');
    res.json(JSON.parse(data));

});

app.get('/blog', (req, res) => {
    res.sendFile(__dirname + '/pages/blog.html');
});

app.get('/write', (req, res) => {
    res.sendFile(__dirname + '/pages/write.html');
});

app.get('/verify', (req, res) => {
    try{
        let payload = jwt.verify(req.cookies.token, KEY);
        console.log(payload.name + ' logined');
        
        res.json({success: true})
    }catch(err){
        console.log('failed to login');
    }
});

app.get('/blog/:title', (req, res) => {
    res.sendFile(__dirname + '/blogs/' + req.params.title + '.html');
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