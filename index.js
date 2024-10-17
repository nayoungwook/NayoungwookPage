const express = require('express');
const { join } = require('path');
const app = express();

const PORT = 80;

app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html');
});

app.get('/admin', (req, res) => {
    res.sendFile(join(__dirname, '/pages/admin.html'));
});

app.listen(PORT, () => {
    console.log('server started in port : ' + PORT);
});