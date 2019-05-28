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

router.get('/all', (req, res, next) => {
    conn.query('SELECT * FROM user', (err, rows, fields) => {
			try {
	      if(!err){
	            res_data = JSON.parse(JSON.stringify(rows));
				res.json(res_data);
	      } else {
	          console.log('Error while performing Query.', err);
	      }
			} catch (e) {
				next(e);
			}

    });
});

router.get('/:id', (req, res, next) => {
	conn.query('SELECT * FROM user WHERE id='+req.params.id, (err, rows, fields) => {
		try {
			if(!err) {
	            res_data = JSON.parse(JSON.stringify(rows));
	            res.json(res_data);
			} else {
				console.log('Error while performing Query.', err);
			}
		} catch(e) {
			next(e);
		}
	});
});

router.post('/insert', (req, res, next) => {
    const u_name = req.body.name || null;
    const u_gender = req.body.gender || null;
    const u_age = req.body.age || null;
		const u_role = req.body.role || null;
    // const u_reference_num = req.body.reference_num || 0;
    // const u_spec = req.body.spec || '';

    let json_obj = {};
    json_obj['name'] = u_name;
    json_obj['gender'] = u_gender;
    json_obj['age'] = u_age;
		json_obj['role'] = u_role;
    let json_str = JSON.stringify(json_obj);

		console.log(u_role);

    let query = "INSERT INTO user (name, gender, age, role) values (?, ?, ?, ?);";
    let param = [u_name, u_gender, u_age, u_role];
    conn.query(query, param, (err, rows, fields) => {
			try{
        if(!err) {
            console.log('insert success');
            let res_data = JSON.parse(JSON.stringify(rows));

            let data_secure = encrypt(json_str, 'temp key');
            let hash_secure = get_hash(json_str);

            let query_secure = "INSERT INTO user_secure (id, data, hash) values ((select id from user where name=? order by id desc limit 1), ?, ?);";
            let param_secure = [u_name, data_secure, hash_secure];

            let insertId = res_data['insertId'];

            conn.query(query_secure, param_secure, (err, results) => {
							try {
                if(!err){
                    console.log('secure insert success!');
                } else {
                    console.log('secure user fail!', err);
                }
							} catch (e) {
								next(e);
							}
            });
            res.json(res_data);
        } else {
            console.log('Error while performing Query.', err);
        }
			} catch(e) {
				next(e);
			}
    });
});

router.delete('/delete', (req, res, next) => {
    const u_id = req.body.id || req.params.id;

    let query = "DELETE FROM user WHERE id = ?;"
    let param = [u_id];
    conn.query(query, param, (err, result) => {
			try {
        if(!err) {
            console.log('delete success');
            res_data = JSON.parse(JSON.stringify(result));
            res.json(res_data);
        } else {
            console.log('Error while performing Query.', err);
        }
			} catch (e) {
				next(e);
			}
    });
});

router.post('/signup', (req, res, next) => {
	if(req.body.gender<0 || req.body.gender>1){
		res.status(500).redirect("/signup");
	}
	else if(req.body.role<0 || req.body.role>1) {
		res.status(500).redirect("/signup");
	}
	else {
		const login_id = req.body.id;
	  const login_password = req.body.password;
	  const user_name = req.body.name;
	  const user_gender = req.body.gender;
	  const user_age = req.body.age;
		const user_role = req.body.role;

	  let query_user = "INSERT INTO user (name, gender, age, role) values (?, ?, ?, ?);"
	  let param_user = [user_name, user_gender, user_age, user_role];

	  conn.query(query_user, param_user, (err, result) => {
			try {
		    if(!err){

		      let res_data = JSON.parse(JSON.stringify(result));
		      let insertId = res_data['insertId'];

		      let hash_pw = get_hash(login_password);

		      let query_login = "INSERT INTO user_sign (login_id, login_password, user_id) values (?, ?, ?);";
		      let param_login = [login_id, hash_pw, insertId];

		      conn.query(query_login, param_login, (err, result) => {
						try {
			        if(!err) {
			          console.log('sign up success');
			          res.redirect("/login");
			        } else {
			          res.status(500);
			        }
						} catch (e) {
							next(e);
						}
		      })
		    } else {
		      console.log("Error while performing Query.", err);
		    }
			} catch (e) {
				next(e);
			}
	  })
	}
});

router.post('/signin', (req, res, next) => {
	const id_login = req.body.id || null;
	const pw_login = req.body.password || null;
	const pw_hash = get_hash(pw_login);

	let query = "SELECT user_id FROM user_sign WHERE login_id=? and login_password=?;";
	let param = [id_login, pw_hash];

	conn.query(query, param, (err, result) => {
		try {
			if(!err) {
				result_json = JSON.parse(JSON.stringify(result));
				if(result_json[0]==undefined){
					console.log('debug');
					//alert("Please reinput your id and password.");
					res.status(500).redirect('/login');
				} else {
					user_id = result_json[0]['user_id'];
					console.log(result_json[0]['user_id'], 'login');
					res.cookie('user_id', user_id);
					res.redirect("/select?id="+user_id);
				}
			} else {
				next(err);
			}
		} catch (e) {
			next(e);
		}
	})
})

module.exports = router;
