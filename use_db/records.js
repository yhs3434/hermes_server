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
	conn.query('SELECT * FROM records', (err, rows, fields) => {
		if(!err){
			res_data = JSON.parse(JSON.stringify(rows));
			res.json(res_data);
		} else {
			console.log('Error while performing Query.', err);
		}
	});
});

router.get('/:id', (req, res) => {
	conn.query('SELECT * FROM records_secure WHERE id='+req.params.id, (err, rows, fields) => {
		if(!err){
			res_data = JSON.parse(JSON.stringify(rows))[0];
			res_data['data'] = JSON.parse(decrypt(res_data['data'], 'temp key'));
			console.log('records get success!');
			res.json(res_data);
		} else {
			console.log('Error while performing Query.', err);
		}
	});
});

router.post('/insert', (req, res) => {
	const user_id = req.body.user_id || null;
	const hospital_id = req.body.hospital_id || null;
	const doctor_id = req.body.doctor_id || null;
	const disease = req.body.disease || null;
	const opinion = req.body.opinion || null;
	const img = req.body.img || null;
	// const section = req.body.section;
	// const rkey = req.body.rkey;
	// const rinfo = req.body.rinfo;

	let json_obj = {};
	json_obj['user_id'] = user_id;
	json_obj['hospital_id'] = hospital_id;
	json_obj['doctor_id'] = doctor_id;
	json_obj['disease'] = disease;
	json_obj['opinion'] = opinion;
	json_obj['img'] = img;
	let json_str = JSON.stringify(json_obj);

	const query = "INSERT INTO records (user_id, hospital_id, doctor_id, disease, opinion, img) values (?, ?, ?, ?, ?, ?);";
	let param = [user_id, hospital_id, doctor_id, disease, opinion, img];
	conn.query(query, param, (err, rows, fields) => {
		if(!err) {
			console.log('insert success');
			let res_data = JSON.parse(JSON.stringify(rows));

			let data_secure = encrypt(json_str, 'temp key');
			let hash_secure = get_hash(json_str);

			let query_secure = "INSERT INTO records_secure (id, data, hash) values ((select id from records where opinion=? order by id desc limit 1), ?, ?);";
			let param_secure = [opinion, data_secure, hash_secure];

			conn.query(query_secure, param_secure, (err, results) => {
				if(!err) {
					console.log('secure insert success!', results);
					res.redirect('/records/all');
				} else {
					console.log('secure user fail!', err);
				}
			});

			//res.json(res_data);
		} else {
			console.log('Error while performing Query.', err);
		}
	});
});

router.delete('/delete', (req, res) => {
    const r_id = req.body.id || req.params.id;

    let query = "DELETE FROM records WHERE id = ?;"
    let param = [r_id];
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