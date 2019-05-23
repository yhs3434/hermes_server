const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/signup', (req, res) => {
  fs.readFile('signup/signup.html', (err, data) => {
		res.writeHead(200, {'Content-Type':'text/html'});
		res.end(data);
	});
});



module.exports = router;
