const express = require('express');
const router = express.Router();

const conn = require('../global/db.js');
const crypto = require('crypto');

function encrypt(text, key) {
	const cipher = crypto.createCipher('aes-256-cbc', key);
	let encipheredContent = cipher.update(text, 'utf8', 'hex');
	encipheredContent += cipher.final('hex');

	return encipheredContent;
}

function decrypt(text, key) {
	const decipher = crypto.createDecipher('aes-256-cbc', key);
	let decipheredContent = decipher.update(text, 'hex', 'utf8');
	decipheredContent += decipher.final('utf8');

	return decipheredContent;
}

router.get('/all', (req, res) => {
    conn.query('SELECT * FROM user', (err, rows, fields) => {
        if(!err){
            res_data = JSON.parse(JSON.stringify(rows));
            res_data = encrypt(res_data);
			res.json(res_data);
        } else {
            console.log('Error while performing Query.', err);
        }
    });
});

router.get('/:id', (req, res) => {
	conn.query('SELECT * FROM user WHERE id='+req.params.id, (err, rows, fields) => {
		if(!err) {
			res_data = JSON.parse(JSON.stringify(rows));
			res.json(res_data);
			console.log(res_data);
		} else {
			console.log('Error while performing Query.', err);
		}
	});
});

router.post('/insert', (req, res) => {
    const u_name = req.body.name;
    const u_gender = req.body.gender || 0;
    const u_age = req.body.age || 0;
    // const u_reference_num = req.body.reference_num || 0;
    // const u_spec = req.body.spec || '';

    let query = "INSERT INTO user (name, gender, age) values (?, ?, ?);";
    let param = [u_name, u_gender, u_age];
    conn.query(query, param, (err, rows, fields) => {
        if(!err) {
            console.log('insert success');
            res_data = JSON.parse(JSON.stringify(rows));
            res.json(res_data);
        } else {
            console.log('Error while performing Query.', err);
        }
    });
});

router.delete('/delete', (req, res) => {
    const u_id = req.body.id || req.params.id;

    let query = "DELETE FROM user WHERE id = ?;"
    let param = [u_id];
    conn.query(query, param, (err, result) => {
        if(!err) {
            console.log('delete success');
            res_data = JSON.parse(JSON.stringify(result));
            res.json(res_data);
        } else {
            console.log('Error while performing Query.', err);
        }
    });
});

module.exports = router;
