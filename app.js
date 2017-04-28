/*eslint-env node */
var express = require("express");
var emoji = require("node-emoji").emoji;
var request = require("request");
var bodyParser = require("body-parser");
var watson = require( "watson-developer-cloud" ); 
const config = require('config');
var workspaceIdVP="320fd5a0-1e2e-4cdc-9068-9a5323837f49";
var session = require("cookie-session");
var path = require("path");

var secret = "****************************";

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBmkiXqLLAmnRnFB7bBr4PENDaZ0e-RMFU'
});

var pageAccessToken="EAAFOp7n8og8BAGvmVdggJzcOEXOqvK7jZCWqnvmIMdeDLHbtI9jSsNVfJDsE0k558UZA8dGaNTDOj3pPVfJBQWVpTi9u0q7qimDyTcCMwho4dlbA37OhZCUiC74dAihMC4cPRvvot5HsOGsbpgDK6V0jCu2jFkTbCtELF6ZBzAZDZD";

const SERVER_URL = (process.env.SERVER_URL) ?
  (process.env.SERVER_URL) :
  config.get('serverURL');


// Facebook payloads
var CallAction = "CALL";
var ContinueWatson = "WATS";


var conversation = watson.conversation( {
  url: "https://gateway.watsonplatform.net/conversation/api",
  password: "gMzq0zzYoeKz",
  username: "856422da-2f4c-4eb4-b03f-2a1d3c73531d",
  version_date: "2016-07-11",
  version: "v1"
} );

var visual_recognition = watson.visual_recognition({
  api_key: "10f176c7bfad6c88a71e1cbe0897feff8de7cb65",
  version: "v3",
  version_date: "2016-05-20"
});

// file is included here:

var app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/* On utilise les contexts */
app.use(session({secret: "flashinfosecret"}));


var contexts;

//Watson part
// Endpoint to be call from the client side
app.post( "/api/message", function() {

} );


/*
 * This path is used for account linking. The account linking call-to-action
 * (sendAccountLinking) is pointed to this URL. 
 * 
 */
app.get('/authorize', function(req, res) {
  var accountLinkingToken = req.query.account_linking_token;
  var redirectURI = req.query.redirect_uri;

  // Authorization Code should be generated per user by the developer. This will 
  // be passed to the Account Linking callback.
  var authCode = "1234567890";

  // Redirect users to this URI on successful login
  var redirectURISuccess = redirectURI + "&authorization_code=" + authCode;

  res.render('authorize', {
    accountLinkingToken: accountLinkingToken,
    redirectURI: redirectURI,
    redirectURISuccess: redirectURISuccess
  });
});

/*
 * Authorization Event
 *
 * The value for 'optin.ref' is defined in the entry point. For the "Send to 
 * Messenger" plugin, it is the 'data-ref' field. Read more at 
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/authentication
 *
 */
function receivedAuthentication(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfAuth = event.timestamp;

  // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
  // The developer can set this to an arbitrary value to associate the 
  // authentication callback with the 'Send to Messenger' click event. This is
  // a way to do account linking when the user clicks the 'Send to Messenger' 
  // plugin.
  var passThroughParam = event.optin.ref;

  console.log("Received authentication for user %d and page %d with pass " +
    "through param '%s' at %d", senderID, recipientID, passThroughParam, 
    timeOfAuth);

  // When an authentication is received, we'll send a message back to the sender
  // to let them know it was successful.
  //sendTextMessage(senderID, "Perfect. How can I help you, today ? \nType Help to have more details regarding my domains of expertize");
}

//assuming app is express Object.
app.get("/license",function(res){
     res.sendFile("licence.html");
});

//Facebook part
// This code is called only when subscribing the webhook //
app.get("/webhook/", function (req, res) {
    if (req.query["hub.verify_token"] === secret) {
        res.send(req.query["hub.challenge"]);
    }
    res.send("Error, wrong validation pageAccessToken");
});

// Incoming messages reach this end point //
app.post("/webhook/", function (req, res) {

    var url;
    var messaging_events, messageData;
    var sender, event, i;
    var  conversationContext = findOrCreateContext(sender);
   
    messaging_events = req.body.entry[0].messaging;
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;
        conversationContext = findOrCreateContext(sender);
        
        ///
        ///   Cas 1 : Message utilisateur
        ///
				if (event.optin) {
          receivedAuthentication(event);
				}
				else if (event.account_linking) {
          receivedAccountLink(event);
					messageData  = {text : "Perfect. How can I help you ? \nType Help to have more details regarding my domains of expertize."};
					sendFBMessage (sender, messageData);
        }
        else if (event.message && event.message.text) {
					console.log("event.message.text : " + event.message.text);
				analyzeTone (sender, event.message.text);
        }

        ///
        ///   Cas 2 : Postback Messenger
        ///
        else if (event.postback) {
        	switch (event.postback.payload) {
            		
        		default:
        			//Get the name
        			url =  "https://graph.facebook.com/v2.6/"+sender+"?fields=first_name&access_token="+pageAccessToken;
					request(url, function (err, response, body) {
				       if (!err && response.statusCode === 200) {
					        conversationContext.name = JSON.parse (body).first_name;
					        console.log ("so ok"+conversationContext.name);
                			messageData = {
        				text: "Hello "+ conversationContext.name + ", I'm Watson your OFN personal banking assistant. I can assist you regarding your financial questions."
    				};
	        		sendFBMessage (sender, messageData);
							sendAccountLinking(sender);
					    }
					    else{
							console.log("error facebook in the beginning "+ err);
							messageData = {text: emoji.no_entry_sign+"Erreur technique : Veuillez renouveler votre demande.Merci"};
							sendFBMessage (sender, messageData);
					    }		    
					});
				break;
	        	}
      }
		
    }
    res.sendStatus(200);
});


/*
 * Send a message with the account linking call-to-action
 *
 */
function sendAccountLinking(recipientId) {
  console.log("SERVER_URL " + SERVER_URL);
	var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "But to start, please sign in with your credentials.",
          buttons:[{
            type: "account_link",
            url: SERVER_URL + "/authorize"
          }]
        }
      }
    }
  };  

  callSendAPI(messageData);
}

/*
 * Send an image using the Send API.
 *
 */
function sendImageMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: "http://crownsavers.co.uk/login/uploads/Loans~General.jpg"
        }
      }
    }
  };

  callSendAPI(messageData);
}

/*
 * Account Link Event
 *
 * This event is called when the Link Account or UnLink Account action has been
 * tapped.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/account-linking
 * 
 */
function receivedAccountLink(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;

  var status = event.account_linking.status;
  var authCode = event.account_linking.authorization_code;

  console.log("Received account link event with for user %d with status %s " +
    "and auth code %s ", senderID, status, authCode);

			
			      
}

/*
 * Call the Send API. The message data goes in the body. If successful, we'll 
 * get the message id in a response 
 *
 */
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: pageAccessToken },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      if (messageId) {
        console.log("Successfully sent message with id %s to recipient %s", 
          messageId, recipientId);
      } else {
      console.log("Successfully called Send API for recipient %s", 
        recipientId);
      }
    } else {
      console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
    }
  });  
}

function callInteractAPI(sender,Indiv_id)
{
  console.log("Interact Call Method");
var options = { method: 'POST',
  url: config.get('InteractURL'),
  headers: 
   { 'content-type': 'application/json' },
  body: 
   { sessionId: '1',
     commands: 
      [ { audienceID: [ { v: Indiv_id, t: 'numeric', n: 'Indiv_id' } ],
          audienceLevel: 'Individual',
          ic: config.get('IC'),
          relyOnExistingSession: false,
          action: 'startSession',
           parameters: 
           [ { v: 'Home', t: 'string', n: 'cc_drop_down2' },
             { v: 'New Loan', t: 'string', n: 'cc_drop_down4' } ],
          debug: true },
        { numberRequested: 1,
          action: 'getOffers',
          ip: config.get('ip') },
        { action: 'endSession' } ] },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

console.log("Nom " + body.responses[1].offerLists[0].offers[0].n);
console.log("Desc " + body.responses[1].offerLists[0].offers[0].desc);

messageData = {text:body.responses[1].offerLists[0].offers[0].desc};
// Function to send the message which has been created just above with the IBM Interact offer attributes to the recipient. 
sendFBMessage (sender, messageData);
// Send a static image due to the fact there is no image in my Interact Offer at this time.
sendImageMessage(sender);
});

}

// This function receives the response data to FB  //
function sendFBMessage(sender,messageData) {
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token: pageAccessToken},
        method: "POST",
        json: {
            recipient: {id: sender},
            message: messageData,
        }      
    }, function (error, response) {
        if (error) {
            console.log("Error sending message: ", error + messageData) ;
        } else if (response.body.error) {	
            console.log("Error sec: ", response.body.error + messageData);
           request({
		        url: "https://graph.facebook.com/v2.6/me/messages",
		        qs: {access_token: pageAccessToken},
		        method: "POST",
		        json: {
		            recipient: {id: sender},
		            message: {text: emoji.no_entry_sign+"Désolé nous sommes confrontés à un problème technique.Merci de votre compréhension"},
		        		}  
		    }, function (error, response) {
		        if (error) {
		            console.log("Error sending message twice: ", error);
			        } else if (response.body.error) {
			            console.log("Error third: ", response.body.error);
			       }
			 });
          }
    });
}

function analyzeTone (sender, inputText) {
      var messageData;
      var params = {
      		text : inputText,
      		language : "french"
      	};
      var  conversationContext = findOrCreateContext(sender);
	  converseText (sender, inputText); 
}


function converseText (sender, inputText) {
		var payloadToWatson = {};
		var messageData;
		var dataText="";
	    var conversationContext = findOrCreateContext(sender);		    	
	    payloadToWatson.input = {
	        text: inputText
	    };
	  	payloadToWatson.workspace_id = conversationContext.workspaceId;
	     if (!conversationContext) conversationContext = {};
	    payloadToWatson.context = conversationContext.watsonContext;
			//console.dir("payloadToWatson : " + payloadToWatson.context);
	    conversation.message( payloadToWatson, function(err, response) {
	    	if (err)
    			console.log("error:", err);
    		else {
					console.log("Detected " + JSON.stringify(response, null, 4));
					console.log('Detected intent: #' + response.intents[0].intent);
					if(response.entities[0]) console.log('Detected Entity: #' + response.entities[0].entity);
					 conversationContext.watsonContext = response.context;
    			if (response.entities[0]) {
						if (response.entities[0].value === "home") {

            callInteractAPI(sender, config.get('Indiv_id'));		
					
          }
					else if (response.entities[0].entity === "réponses")
					{
						messageData = {
								"attachment":{
									"type":"template",
									"payload":{
										"template_type":"button",
										"text":emoji.phone + "We can discuss by phone about it right now?",
											"buttons":[
												{
														"type":"phone_number",
														"title":"Yes",
														"payload":"+336601010"
												},
											{
												"type":"postback",
												"title":"No",
												"payload": ContinueWatson
											}
										]
									}
								}
							};
						//sendFBMessage (sender, {text:response.output.text[0]});
						sendFBMessage (sender, messageData);
					}
					else {
	       		 	conversationContext = response.context;
								console.log("response.context " + JSON.stringify(response.context, null, 4));
		        	//sendFBMessage (sender, {text:response.output.text[0]});
							 for (l=0;l<response.output.text.length;l++)
                        {
                            if (dataText) dataText = dataText +"\n";
                            dataText = dataText + response.output.text[l];
                        }
                        sendFBMessage (sender, {text:dataText});  
	        	}
				}
				else {
	       		 	conversationContext = response.context;
								console.log("response.context " + JSON.stringify(response.context, null, 4));
		        	//sendFBMessage (sender, {text:response.output.text[0]});
							 for (l=0;l<response.output.text.length;l++)
                        {
                            if (dataText) dataText = dataText +"\n";
                            dataText = dataText + response.output.text[l];
                        }
                        sendFBMessage (sender, {text:dataText});  
	        	}
	        }
	    });
}

function findOrCreateContext (convId){
      // Let's see if we already have a session for the user convId
    if (!contexts)
        contexts = [];
        
    if (!contexts[convId]) {
        // No session found for user convId, let's create a new one
        //with Michelin concervsation workspace by default
        contexts[convId] = {workspaceId: workspaceIdVP, watsonContext: {}};
        //console.log ("new session : " + convId);
    }
return contexts[convId];
}
var host = process.env.VCAP_APP_HOST || "localhost";
var port = process.env.VCAP_APP_PORT || 3000;
app.set('view engine', 'ejs');
//app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.listen(port, host);