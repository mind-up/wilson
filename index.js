const http = require('http');
const https = require('https');
const { RTMClient } = require('@slack/client');

// Initialize using verification token from environment variables
// const settings = require('./settings');
const token = process.env.TOKEN;// settings.token;
const createSlackEventAdapter = require('@slack/events-api').createSlackEventAdapter;
const slackEvents = createSlackEventAdapter(process.env.VERIFICATION_TOKEN);
const port = process.env.PORT || 80;
const rtm = new RTMClient(token);
rtm.start();

// Initialize an Express application
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// You must use a body parser for JSON before mounting the adapter
app.use(bodyParser.json());

// Mount the event handler on a route
// NOTE: you must mount to a path that matches the Request URL that was configured earlier
app.use('/wilson', slackEvents.expressMiddleware());

// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on('message', (event)=> {
	console.log('message', JSON.stringify(event, null, 2));
	let text = event.text;
	let wilsonId = '<@U9S5FS612>';
	if(text && text.includes(wilsonId)) {
		try {
			let splittedText = text.split('"');
			console.log('splittedt', splittedText);
			let quote = text.split('"')[1];
			let conversationId = text.split('" in ')[1];
			conversationId = conversationId.split('#')[1].split('|')[0];
			console.log(quote, conversationId);
		
			rtm.sendMessage(quote, conversationId)
				.then((res) => {
					console.log('Message sent: ', res.ts);
				})
				.catch(console.error);
		} catch (error) {
			console.error(error);
		}
	}
});

slackEvents.on('app_mention', (event)=> {
	console.log('app_mention : ', JSON.stringify(event, null, 2));
});

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

// Start the express application
http.createServer(app).listen(port, () => {
	console.log(`server listening on port ${port}`);
});
