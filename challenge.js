const express = require('express');
const port    = 80;
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.listen(port);
app.post('/wilson', function (req, res) {
	console.log('body', req.body);
	if(req.body && req.body.challenge) {
		res.send(req.body.challenge);
		console.log('response sent');
	} else {
		res.send('no challenge');
		console.log('no challenge');
	}
});
