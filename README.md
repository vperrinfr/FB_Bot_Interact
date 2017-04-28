# Facebook Messenger Bot using [IBM Interact](https://www.ibm.com/ms-en/marketplace/real-time-inbound-marketing) prototype

This application demonstrates a simple, reusable Facebook Messenger bot using [Watson Conversation] (https://www.ibm.com/watson/developercloud/conversation.html) & [IBM Interact](https://www.ibm.com/ms-en/marketplace/real-time-inbound-marketing).

## Demonstration

You can find a demo illustrating that bot [here](https://ibm.box.com/s/6v0rckk0f384f332asmjhy4q38b4ch55)

## Steps

1. Fork the code

2. Upload Dialog 
+ Dialog can be found [here](https://github.com/vperrinfr/FB_Bot_Interact/blob/master/dialog.json)
+ Upload it in your Watson Conversation service [documentation](https://www.ibm.com/watson/developercloud/doc/conversation/index.html)
+ Retrieve the Workspace ID
+ Put that ID in app.js file in the var *workspaceIdVP*

3. Deploy that app on Bluemix [documentation](https://console.ng.bluemix.net/docs/starters/upload_app.html)

4. Register your bot
+ Follow this documentation [here](https://developers.facebook.com/docs/messenger-platform/guides/quick-start)
`Note : the url of the webhook will be something like https://[app_name].mybluemix.net/webhook`

5. Test the chat

## Troubleshooting

Access to log, type this command `cf logs [app_name] --recent` to analyze any trouble with the dialog.

## Modification of the dialog

:children_crossing: In progress

## IBM Interact Call

This is the method to call IBM Interact service.

```JavaScript
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
```

In my code, the method is called when the dialog recognize the entity "Home" from the Watson Conversation service. It can easily be changed.
```JavaScript
if (response.entities[0].value === "home") {
  callInteractAPI(sender, config.get('Indiv_id'));		
}
```
