const { WebClient, RTMClient} = require('@slack/client');
const settings = require('./settings');

// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = settings.token;
const channelId = 'C9S6D2FUJ'; // test

//const web = new WebClient(token);
// See: https://api.slack.com/methods/chat.postMessage
//web.chat.postMessage({ channel: channelId, text: 'Hello there (web)' })
//	.then((res) => {
//		// `res` contains information about the posted message
//		console.log('Message sent: ', res.ts);
//	})
//	.catch(console.error);


// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);
rtm.start();


// The RTM client can send simple string messages
rtm.sendMessage('Hello there (rtm)', channelId)
	.then((res) => {
		// `res` contains information about the posted message
		console.log('Message sent: ', res.ts);
	})
	.catch(console.error);


// Initialize using verification token from environment variables
const createSlackEventAdapter = require('@slack/events-api').createSlackEventAdapter;
const slackEvents = createSlackEventAdapter(settings.verificationToken);
const port = process.env.PORT || 3000;

// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on('message', (event) => {
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
});

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

// Start a basic HTTP server
slackEvents.start(port).then(() => {
  console.log(`server listening on port ${port}`);
});
