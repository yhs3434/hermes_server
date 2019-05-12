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

function get_hash(text) {
    const shasum = crypto.createHash('sha1');
    shasum.update(text);
    return shasum.digest('hex');
}

router.get('/all', (req, res) => {
    conn.query('SELECT * FROM user', (err, rows, fields) => {
        if(!err){
            res_data = JSON.parse(JSON.stringify(rows));
            let e = encrypt(res_data, 'key');
            console.log('encrypt : ' + e);
            let d = decrypt(e, 'key');
            console.log('decrypt : ' + d);
			res.json(res_data);
        } else {
            console.log('Error while performing Query.', err);
        }
    });
});

router.get('/:id', (req, res) => {
	conn.query('SELECT * FROM user_secure WHERE id='+req.params.id, (err, rows, fields) => {
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

    let json_obj = {};
    json_obj['name'] = u_name;
    json_obj['gender'] = u_gender;
    json_obj['age'] = u_age;
    let json_str = JSON.stringify(json_obj);

    let query = "INSERT INTO user (name, gender, age) values (?, ?, ?);";
    let param = [u_name, u_gender, u_age];
    conn.query(query, param, (err, rows, fields) => {
        if(!err) {
            console.log('insert success');
            let res_data = JSON.parse(JSON.stringify(rows));

            let data_secure = encrypt(json_str, 'temp key');
            let hash_secure = get_hash(json_str);

            let query_secure = "INSERT INTO user_secure (id, data, hash) values ((select id from user where name=? order by id desc limit 1), ?, ?);";
            let param_secure = [u_name, data_secure, hash_secure];

            conn.query(query_secure, param_secure, (err, results) => {
                if(!err){
                    console.log('secure insert success!');
                } else {
                    console.log('secure user fail!', err);
                }
                
            })

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
