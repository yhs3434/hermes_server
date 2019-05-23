const express = require('express');
const router = express.Router();

const conn = require('../global/db.js');
const crypto = require('crypto');

const Web3 = require("web3");
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
let abi = [
   {
           "constant": false,
           "inputs": [
                   {
                           "name": "_user_id",
                           "type": "uint256"
                   },
                   {
                           "name": "_data_num",
                           "type": "uint256"
                   },
                   {
                           "name": "_data_hash",
                           "type": "string"
                   }
           ],
           "name": "Change_list",
           "outputs": [],
           "payable": false,
           "stateMutability": "nonpayable",
           "type": "function"
   },
   {
           "constant": false,
           "inputs": [
                   {
                           "name": "_user_id",
                           "type": "uint256"
                   },
                   {
                           "name": "_data_num",
                           "type": "uint256"
                   },
                   {
                           "name": "_data_hash",
                           "type": "string"
                   }
           ],
           "name": "Input_list",
           "outputs": [],
           "payable": false,
           "stateMutability": "nonpayable",
           "type": "function"
   },
   {
           "inputs": [],
           "payable": false,
           "stateMutability": "nonpayable",
           "type": "constructor"
   },
   {
           "constant": true,
           "inputs": [
                   {
                           "name": "",
                           "type": "uint256"
                   },
                   {
                           "name": "",
                           "type": "uint256"
                   }
           ],
           "name": "record_list",
           "outputs": [
                   {
                           "name": "",
                           "type": "string"
                   }
           ],
           "payable": false,
           "stateMutability": "view",
           "type": "function"
   },
   {
           "constant": true,
           "inputs": [
                   {
                           "name": "_user_id",
                           "type": "uint256"
                   },
                   {
                           "name": "_data_num",
                           "type": "uint256"
                   }
           ],
           "name": "Show_list",
           "outputs": [
                   {
                           "name": "",
                           "type": "string"
                   }
           ],
           "payable": false,
           "stateMutability": "view",
           "type": "function"
   }
];

let contract_addr = "0x24cc233a30e1c4aef82082c64e2bc935de48c324";
let user_contract = new web3.eth.Contract(abi, contract_addr);


function ether_input(id, data, hash){
   let new_account = '';
   web3.eth.getAccounts().then(e => {
      new_account = e[0];
      console.log("new_account : ",new_account);
      user_contract.methods.Input_list(id, data, hash).send({
         from: new_account,
         gas: 100000
      }, (err, result) => {
         if(!err) {
            console.log("Block ether input success!");
            console.log(result);
         } else {
            console.log("error");
            console.log(err);
         }
      });
   })

}

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
            user_data = res_data[0];
            console.log("encrypt : ");
            console.log(user_data);
            console.log("\n\n\n");
         user_data['data'] = decrypt(user_data['data'], 'temp key');
            console.log("decrypt : ");
            console.log(user_data);
            res.json(JSON.parse(user_data['data']));
		} else {
			console.log('Error while performing Query.', err);
		}
	});
});

router.post('/insert', (req, res) => {
    const u_name = req.body.name || null;
    const u_gender = req.body.gender || null;
    const u_age = req.body.age || null;
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

            let insertId = res_data['insertId'];

            conn.query(query_secure, param_secure, (err, results) => {
                if(!err){
                    console.log('secure insert success!');
                    ether_input(insertId, 10, hash_secure);
                } else {
                    console.log('secure user fail!', err);
                }
                console.log(results);

            });
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

router.post('/signup', (req, res) => {
  const login_id = req.body.id;
  const login_password = req.body.password;
  const user_name = req.body.name;
  const user_gender = req.body.gender;
  const user_age = req.body.age;

  let query_user = "INSERT INTO user (name, gender, age) values (?, ?, ?);"
  let param_user = [user_name, user_gender, user_age];

  conn.query(query_user, param_user, (err, result) => {
    if(!err){

      let res_data = JSON.parse(JSON.stringify(result));
      let insertId = res_data['insertId'];

      let hash_pw = get_hash(login_password);

      let query_login = "INSERT INTO user_sign (login_id, login_password, user_id) values (?, ?, ?);";
      let param_login = [login_id, hash_pw, insertId];

      conn.query(query_login, param_login, (err, result) => {
        if(!err) {
          console.log('sign up success');
          res.redirect("/login");
        } else {
          res.status(500);
        }
      })
    } else {
      console.log("Error while performing Query.", err);
    }
  })
})

module.exports = router;
