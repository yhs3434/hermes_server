const express = require('express');
const router = express.Router();

const conn = require('../global/db.js');

router.get('/all', (req, res) => {
	conn.query('SELECT * FROM hospital', (err, rows, fields) => {
		if(!err){
			res_data = JSON.parse(JSON.stringify(rows));
			res.json(res_data);
		} else {
			console.log('Error while performing Query.', err);
		}
	});
});

router.get('/:id', (req, res) => {
	conn.query('SELECT * FROM hospital WHERE id='+req.params.id, (err, rows, fields) => {
		if(err) {
			console.log('Error while performing Query.', err);
			return;
		}
		res_data = JSON.parse(JSON.stringify(rows));
		res.json(res_data);
	});
});

module.exports = router;