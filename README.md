# react-axios-interceptor
This interceptor handles the access and refreshes token process of oauth2 protocol.

when you integrate an oauth2 protocol into a react app probably you need an interceptor to skip unnecessary code duplications.

Requirement: 
1. when the access token is expired, you need to get a new access token and update cookies or local storage or redux store with latest access token.
2. when the refresh token is expired, you need to logout from the system.
3. set the bearer token for each request. (GET, POST,PUT,DELETE)

if you don't use an interceptor,  you have to handle the above requirement for each Axios (AJAX) calls.

Where to add interceptor in react app.

You need to add the interceptor at the root level in the component tree. I have put it in App.js because index.js have used to redux, saga integration and also inside intercepter, redux action have been dispatched. 

