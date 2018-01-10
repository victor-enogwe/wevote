const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'src/index.html'));
});


app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});