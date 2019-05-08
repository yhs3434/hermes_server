const express = require('express');
const router = express.Router();

const conn = require('../global/db.js');

router.get('/all', (req, res) => {
    conn.query('SELECT * FROM user', (err, rows, fields) => {
        if(!err){
			res_data = JSON.parse(JSON.stringify(rows));
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
		} else {
			console.log('Error while performing Query.', err);
		}
	});
});

router.post('/', (req, res) => {
    const u_name = req.body.name;
    const u_gender = req.body.gender || 0;
    const u_age = req.body.age || 0;
    // const u_reference_num = req.body.reference_num || 0;
    // const u_spec = req.body.spec || '';

    let query = "INSERT INTO user (name, gender, age) values (?, ?, ?);";
    let param = [u_name, u_gender, u_age];
    conn.query(query, param, (err, rows, fields) => {
        if(!err) {
            res_data = JSON.parse(JSON.stringify(rows));
            res.json(res_data);
        } else {
            console.log('Error while performing Query.', err);
        }
    });
});

module.exports = router;