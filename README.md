# react-axios-interceptor
This interceptor handle the access and refresh token process of oauth2 protocol.

when you intigrate a oauth2 protocol into a react app problly you need a interceptor to skip unnessory code duplicatios.

Requirement: 
1. when the acces token is expired, you need to get new acces token and update cookies or local storage with latest acces token
2. when the referesh token is expired, you need to logout frome the system.

