let express = require('express');
let app = express();

app.get('/', (req, res) => {
	res.send('test test');
});

app.listen(3000, () => {
	console.log('Example app listening on port 3000!');
});
