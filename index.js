const express = require('express');
const app = express();
const fs = require('fs');
const { join } = require('path');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');

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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/blogs');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

function getDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');

    const dateString = year + '-' + month + '-' + day;

    return dateString;
}

const upload = multer({ storage });
app.post('/upload', upload.fields([
    { name: 'html', maxCount: 1 },
    { name: 'files', maxCount: 100 }
]), (req, res) => {
    if (!req.files) {
        return res.status(400).send('Failed to upload file');
    }

    if(!req.files['html']){
        console.error('Error with uploading html file.');
        return;
    }

    try{
        let htmlFile = req.files['html'];
        
        let date = getDate();
        
        let blogDataJson = JSON.parse(fs.readFileSync(__dirname + '/blogs/blogData.json'));
        let newBlogData = {};
        
        let htmlFileName = htmlFile[0].filename;
        
        if(htmlFileName.substr(htmlFileName.length - 5, htmlFileName.length - 1) != '.html'){
            console.error('Error with uploading html file because of wrong file format');
            return;
        }
        
        newBlogData['title'] = htmlFileName.substr(0, htmlFileName.length - 5);
        newBlogData['date'] = date;
        
        blogDataJson[Object.keys(blogDataJson).length] = newBlogData;
        
        fs.writeFileSync(__dirname + '/blogs/blogData.json', JSON.stringify(blogDataJson));
        
        return res.send({message: 'success'});
    }catch(e){
        return res.status(400).send('Failed to upload file');
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