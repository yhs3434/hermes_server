const express = require('express');
const router = express.Router();

const conn = require('../global/db.js');

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
	conn.query('SELECT * FROM records WHERE id='+req.params.id, (err, rows, fields) => {
		if(!err){
			res_data = JSON.parse(JSON.stringify(rows));
			res.json(res_data);
		} else {
			console.log('Error while performing Query.', err);
		}
	});
});

router.post('/insert', (req, res) => {
	const user_key = req.body.user_key;
	const hospital_key = req.body.hospital_key;
	// const doctor_key = req.body.doctor_key;
	const disease = req.body.disease;
	const opinion = req.body.opinion;
	// const section = req.body.section;
	// const rkey = req.body.rkey;
	// const rinfo = req.body.rinfo;

	const query = "INSERT INTO records (user_id, hospital_id, disease, opinion) values (?, ?, ?, ?);";
	let param = [user_key, hospital_key, disease, opinion];
	conn.query(query, param, (err, rows, fields) => {
		if(!err) {
			console.log('insert success');
			res_data = JSON.parse(JSON.stringify(rows));
			res.json(res_data);
		} else {
			console.log('Error while performing Query.', err);
		}
	})
})

module.exports = router;