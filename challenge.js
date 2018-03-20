var express = require('express')
var app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/wilson', function (req, res) {
	console.log('body', req.body);
	if(req.body && req.body.challenge) {
		res.send(res.send(req.body.challenge));
		console.log('response sent');
	} else {
		res.send(res.send('no challenge'));
		console.log('no challenge');
	}
})

app.listen(80);
