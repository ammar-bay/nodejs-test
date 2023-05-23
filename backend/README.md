# Auth

Access token is stored in application state
Refresh token is stored as http only cookie so that javascript cant access it
Access token comes in the header of req and it is used to verify if the person sending the request is authorized
Refresh token comes as http only cookie and it is used to refress access token when it expires
When the refresh token expires then you need to login again

Access token only contains role and username which is unique
