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
    "gender": "Female",
    "smokingHabit": "Never",
    "physicalActivity": "Sedentary (little or no exercise)",
    "alcoholConsumption": "Never",
    "hobby_1": "Badminton",
    "hobby_2": "Swimming",
    "hobby_3": "Cycling",
    "location": "Yogyakarta",
    "height": 180,
    "weight": 70
}
  
- **Response**:
   ```json

  {
    "status": "success",
    "message": "Profile created",
    "data": {
        "profileId": "49f662a2-7afa-49bb-b652-f859c5422924",
        "userId": "005e9806-3061-45b7-b710-4654e9f957f5",
        "age": 20,
        "gender": 0,
        "smokingHabit": 1,
        "physicalActivity": 1,
        "alcoholConsumption": 1,
        "createdAt": "2024-06-10 14:43:42",
        "hobby_1": 2,
        "hobby_2": 3,
        "hobby_3": 4,
        "location": "Yogyakarta",
        "height": 180,
        "weight": 70
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

