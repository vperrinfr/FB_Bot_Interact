#Facebook Messenger Bot using [IBM Interact](https://www.ibm.com/ms-en/marketplace/real-time-inbound-marketing) prototype

This application demonstrates a simple, reusable Facebook Messenger bot using [Watson Conversation] (https://www.ibm.com/watson/developercloud/conversation.html) & [IBM Interact](https://www.ibm.com/ms-en/marketplace/real-time-inbound-marketing).

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

:children_crossing: In progress
