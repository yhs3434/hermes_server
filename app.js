const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const user = require('./use_db/user.js');
const hospital = require('./use_db/hospital.js');
const records = require('./use_db/records.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/user', user);
app.use('/hospital', hospital);
app.use('/records', records);

app.listen(30001, () => {
    console.log('start');
})
