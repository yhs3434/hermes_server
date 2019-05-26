const express = require('express');
const router = express.Router();

const conn = require('../global/db.js');
const crypto = require('crypto');

const Web3 = require("web3");
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

let contract_addr = "0xd7cd396bcce38f1c4aa8d497a6c4846b192120c4";

let abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_records_id",
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
				"name": "_records_id",
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
		"constant": true,
		"inputs": [
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
				"name": "_records_id",
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
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	}
];


let user_contract = new web3.eth.Contract(abi, contract_addr);


function ether_input(id, hash){
   let new_account = '';
   web3.eth.getAccounts().then(e => {
      new_account = e[0];
      console.log("new_account : ",new_account);
      user_contract.methods.Input_list(id, hash).send({
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
	conn.query('SELECT * FROM records_secure', (err, rows, fields) => {
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
			let records_id = res_data['id'];
			let hash_secure = res_data['hash'];
			let decrypt_key = '' + records_id + hash_secure.substring(parseInt(hash_secure.length/2), hash_secure.length);
			console.log(records_id, hash_secure, decrypt_key);
			res_data['data'] = JSON.parse(decrypt(res_data['data'], decrypt_key));
			console.log('records get success!');
			res.json(res_data);
		} else {
			console.log('Error while performing Query.', err);
		}
	});
});

router.get('/doctor/:user_id', (req, res) => {
	const user_id = req.params.user_id || 0;

	let query = "SELECT * FROM records WHERE user_id = ?";
	let param = [user_id];

	conn.query(query, param, (err, rows, fields) => {
		if(err) {
			res.status(500).send('NO');
			console.log('Error while performing Query.', err);
		} else {
			res_data = JSON.parse(JSON.stringify(rows));
			res.status(200).send(res_data);
		}
	})
})

router.post('/insert', (req, res) => {
	const user_id = req.body.user_id || null;
	const doctor_id = req.body.doctor_id || null;
	const disease = req.body.disease || null;
	const opinion = req.body.opinion || null;
	const img = req.body.img || null;
	const contract_addr = req.body.contract_addr || null;
	const hospital_id = req.body.hospital_id || null;
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
	json_obj['contract_addr'] = contract_addr;
	json_obj['regTime'] = Date.now();
	let json_str = JSON.stringify(json_obj);

	const query = "INSERT INTO records (user_id, hospital_id, doctor_id, disease, opinion, img, contract_addr) values (?, ?, ?, ?, ?, ?, ?);";
	let param = [user_id, hospital_id, doctor_id, disease, opinion, img, contract_addr];
	conn.query(query, param, (err, rows, fields) => {
		if(!err) {
			console.log('insert success');
			let res_data = JSON.parse(JSON.stringify(rows));

			let insertId = res_data['insertId'];

			let hash_secure = get_hash(json_str);
			let encrypt_key = '' + insertId + hash_secure.substring(parseInt(hash_secure.length/2), hash_secure.length);
			console.log("encrypt_key", encrypt_key);
			let data_secure = encrypt(json_str, encrypt_key);

			let query_secure = "INSERT INTO records_secure (id, data, hash) values ((select id from records where opinion=? order by id desc limit 1), ?, ?);";
			let param_secure = [opinion, data_secure, hash_secure];



			conn.query(query_secure, param_secure, (err, results) => {
				if(!err) {
					console.log('secure insert success!');
					ether_input(insertId, hash_secure);
					res.status(200).send('OK');
				} else {
					console.log('secure record fail!', err);
					res.status(500).send('NO');
				}
			});

		} else {
			console.log('Error while performing Query.', err);
			res.status(500).send('NO');
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
