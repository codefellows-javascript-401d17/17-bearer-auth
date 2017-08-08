# Basic Auth - Lab 16

### Description:

This app is a RESTful api that allows users to sign up and sign in. The user creates a user account with a username, password and email. When the user signs in that data is

### Routes:
#### POST:
The user makes a post request upon sign up. The username and email submitted must be unique to the app (no duplicates). The password is encrypted with a base64 hash and all the data is stored to the database. Once successful the user get a token for that session that would allow them to access other routes that would be available within the app.

#### GET:
The user makes a get request upon sign in. The username and password entered get checked against the user data already stored in the database. If what is entered is valid then the user will receive a token to access the other routes that would be available in the app. If not then the user will get rejected as unauthorized. 
