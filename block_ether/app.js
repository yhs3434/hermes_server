var express = require("express");
var app = express();
var server = require("http").createServer(app);
server.listen(8080);
app.use(express.static("public"));
app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
})
var Web3 = require("web3");
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var userC = new web3.eth.Contract([
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "user_list",
		"outputs": [
			{
				"name": "key",
				"type": "address"
			},
			{
				"name": "data_hash",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_key",
				"type": "address"
			}
		],
		"name": "Show_list",
		"outputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_key",
				"type": "address"
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
	}
],"0x4bab03188f1287795ff9b3902af0dfd63e49c295");



app.get("/Input", function(req, res){
	var key = req.query.key;
	var data_hash=req.query.data_hash;
    userC.methods.Input_list(key,data_hash).send({
		from:"0x7a8d646f08e5a5489eae0526d939f302e539d7d3",
		gas:100000
	},function(error,result){
		console.log("hello");
		console.log(result);
	})
})

app.get("/showData", function(req, res){
    var key = req.query.key;
    var details=userC.Show_list.call(key);
    res.send(details);
})


var ad="0x7a8d646f08e5a5489eae0526d939f302e539d7d3";
var se=0;
var birt=199408;
console.log("hello");
userData.methods.Input_list(ad,se,birt).send({
    from:"0x7a8d646f08e5a5489eae0526d939f302e539d7d3",
    gas: 100000
},function(error,result){
    console.log("hello");
    console.log(result);
})