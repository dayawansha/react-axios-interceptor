# react-axios-interceptor
This interceptor handles the access and refreshes token process of oauth2 protocol.

when you integrate an oauth2 protocol into a react app probably you need an interceptor to skip unnecessary code duplications.

Requirement: 
1. when the access token is expired, you need to get a new access token and update cookies or local storage or redux store with latest access token.
2. when the refresh token is expired, you need to logout from the system.
