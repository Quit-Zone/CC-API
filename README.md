# QuitZone-CC
Part of QuitZone C241-PS024 - CC Setup

ML - NOTEBOOK
https://colab.research.google.com/drive/13mBjmnS8tLtOKSB2aD1YAKQCj-k0UWbL#scrollTo=e59ncAO8L6QE

## API DOCUMENTATION
### Register
- **Method**: POST
- **URL**: `/register`
- **Body Request**:
  ```json
  {
    "name": "test",
    "email": "test@email.com",
    "pass": "password"
  }
- **Response**:
   ```json
  {
  "status": "success",
  "message": "Data saved",
  "data":{
    "id": "some_id",
    "email": "test@email.com",
    "username": "test",
    "createdAt": "2023-01-01T00:00:00Z"
    }
  }

##Login
- **Method**: POST

- **URL**: `/login`

- **Body Request**:
  ```json
  {
  "email": "test@email.com",
  "pass": "password"
  }

- **Response**:
   ```json
  {
  "status": "success",
  "message": "login successful",
  "token": "<token>",
  "data": {
   "id": "user_id",
   "email": "test@email.com",
   "username": "test",
   "createdAt": "2023-01-01T00:00:00Z"
    }
  }

##Create Profile

- **Method**: POST

- **URL**: `/profile`

Headers

Key = Authorization

Value = Bearer (token from login)

- **Body Request**:
  ```json

  {
    "age": 20,
    "gender": "male",
    "smokingHabit": "jarang",
    "physicalActivity": "tidak pernah",
    "alcoholConsumption": "sering",
    "hobby_1": "lari",
    "hobby_2": "joging",
    "hobby_3": "hike",
    "location": "bandung"
  }
  
- **Response**:
   ```json

  {
    "status": "success",
    "message": "Profile created"
    "data": {
    "profileId",
    "userId",
    "age": 20,
    "gender": "male",
    "smokingHabit": "jarang",
    "physicalActivity": "tidak pernah",
    "alcoholConsumption": "sering",
    "hobby_1": "lari",
    "hobby_2": "joging",
    "hobby_3": "hike",
    "location": "bandung"
    }
  }
##create wallet
- **Method**: POST

- **URL**:`/wallet`

Headers

Key = Authorization

Value = Bearer (token from login)
- **Body Request**:
  ```json
  {
    "amount": 100000
  }
  
- **Response**:
   ```json

  {
    "status": "success",
    "message": "Wallet created successfully",
    "data": {
        "walletId",
        "userId",
        "amount",
    }
  }
##get Wallet
- **Method**:GET

- **URL**:`/wallet`

Headers

Key = Authorization

Value = Bearer (token from login)

- **Response**:
   ```json

  {
    "status": "success",
    "data": {
       "walletId",
       "userId",
       "amount",
     },
   }

