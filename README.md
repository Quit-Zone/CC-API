Register
Method: POST

URL: /register

Body Request

{
  "name": "test",
  "email": "test@email.com",
  "pass": "password"
}
Response

{
  "status": "success",
  "message": "Data saved",
  "data": {
    id,
    email,
    username,
    createdAt,
  }
}

Login
Method: POST

URL: /login

Body Request
{
  "email": "test@email.com",
  "pass": "password"
}

Response
{
  "status": "success",
  "message": "login successful",
  token: token,
  "data": {
      user.id,
      user.email,
      user.username,
      user.created_at,
  }
}

Create Profile

Method: POST

URL: /profile

Headers

Key = Authorization

Value = Bearer (token from login)

Body Request

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
Response

{
    "status": "success",
    "message": "Profile created"
    data: {
        profileId,
        userId,
        age,
        gender: genderBoolean,
        smokingHabit : smokingBoolean,
        physicalActivity : activityBoolean,
        alcoholConsumption : alcoholBoolean,
        createdAt,
        hobby_1,
        hobby_2,
        hobby_3,
        location,
    }
}
create wallet
Method: POST

URL:/wallet

Headers

Key = Authorization

Value = Bearer (token from login)

Response

{
    "status": "success",
    "message": "Wallet created successfully",
    "data": {
        walletId,
        userId,
        amount,
    }
}
get Wallet
Method:GET

URL:/wallet

Headers

Key = Authorization

Value = Bearer (token from login)

Response

{
    "status": "success",
    "data": rows,
}
