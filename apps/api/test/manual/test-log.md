My Test Log
Test 1: Health Check

Date/Time: 12/01/26 - 23:30

Command:

curl http://localhost:5001/api/health


Expected:
JSON response with status

Actual Result:

curl http://localhost:5001/health

{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2026-01-12T18:07:15.239Z"
  }
}


Status: ✅ PASS

Notes:
None

Auth Code Locations

Where is the auth route defined?
src/routes/auth.routes.ts

Where is the registration logic?
src/controller/auth.controller.ts

Where is password hashing done?
src/utils/password.ts

Where are JWT tokens generated?
src/utils/jwt.ts

Level 1 Test Results

Name: Sadik Shaikh
Date/Time: 12/01/26 - 23:30

Part A: Project Exploration
My Project Structure
total 32
drwxr-xr-x@ 14 Admin staff 448 Jan 10 16:47 .
drwxr-xr-x@ 11 Admin staff 352 Jan 12 23:31 ..
-rw-r--r--@ 1 Admin staff 5996 Jan 12 23:37 app.ts
drwxr-xr-x@ 4 Admin staff 128 Jan 11 20:32 config
drwxr-xr-x@ 7 Admin staff 224 Jan 10 16:47 controllers
drwxr-xr-x@ 8 Admin staff 256 Jan 10 16:47 data
drwxr-xr-x@ 4 Admin staff 128 Jan 10 16:47 errors
drwxr-xr-x@ 6 Admin staff 192 Jan 10 16:47 middleware
drwxr-xr-x@ 8 Admin staff 256 Jan 11 14:49 routes
-rw-r--r--@ 1 Admin staff 6697 Jan 11 20:27 server.ts
drwxr-xr-x@ 7 Admin staff 224 Jan 10 16:47 services
drwxr-xr-x@ 6 Admin staff 192 Jan 10 16:47 types
drwxr-xr-x@ 9 Admin staff 288 Jan 10 16:47 utils
drwxr-xr-x@ 7 Admin staff 224 Jan 10 16:47 validators

Key Files I Found

Entry point: server.ts

Auth routes file: src/routes/auth.routes.ts

Auth controller/service: src/controller/auth.controller.ts

My package.json Scripts
"scripts": {
  "dev": "turbo run dev",
  "build": "turbo run build",
  "lint": "turbo run lint",
  "test": "turbo run test",
  "db:migrate": "npm run db:migrate --workspace=apps/api",
  "db:seed": "npm run db:seed --workspace=apps/api",
  "api:dev": "npm run dev --workspace=apps/api",
  "web:dev": "npm run dev --workspace=apps/web"
}

Part B: Server Status

Server start command: npm run dev

Server running on port: 5001

Any startup errors: No

Part C: Registration Tests
Test AUTH-01: Valid Registration

Command:

curl -X POST http://localhost:5001/api/v1/auth/register/email \
-H "Content-Type: application/json" \
-d '{
  "email": "level1test@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}'


Status Code: 200 / 201

Response Body:

{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "JWT_ACCESS_TOKEN",
      "refreshToken": "JWT_REFRESH_TOKEN"
    },
    "user": {
      "id": "70ca0800-50f7-4c63-b2d1-63d2ada6a318",
      "email": "level1test@example.com",
      "phoneNumber": null,
      "role": "PROVIDER",
      "isVerified": false
    },
    "hasProvider": false
  }
}


PASS/FAIL: ✅ PASS

Test AUTH-02: Duplicate Email

Command: (same as AUTH-01)

Response Body:

{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Email already registered"
  }
}


PASS/FAIL: ✅ PASS

Test AUTH-03: Weak Password

Command:

curl -X POST http://localhost:5001/api/v1/auth/register/email \
-H "Content-Type: application/json" \
-d '{
  "email": "weak@example.com",
  "password": "123",
  "confirmPassword": "123"
}'


Response Body:

{
  "success": false,
  "error": {
    "message": "Validation failed"
  }
}


PASS/FAIL: ✅ PASS

Test AUTH-04: Password Mismatch

Command:

curl -X POST http://localhost:5001/api/v1/auth/register/email \
-H "Content-Type: application/json" \
-d '{
  "email": "mismatch@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "DifferentPass!"
}'


Response Body:
User created successfully (unexpected)

PASS/FAIL: ❌ FAIL

Notes:
Password mismatch is not being validated.

Test AUTH-05: Invalid Email

Command:

curl -X POST http://localhost:5001/api/v1/auth/register/email \
-H "Content-Type: application/json" \
-d '{
  "email": "not-an-email",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}'


PASS/FAIL: ✅ PASS

Test AUTH-06: Missing Fields

Command:

curl -X POST http://localhost:5001/api/v1/auth/register/email \
-H "Content-Type: application/json" \
-d '{
  "email": "missing@example.com"
}'


PASS/FAIL: ✅ PASS

Final Checklist

I can start my server without errors

I know where my source code is (src/ folder)

I found the auth-related files

I ran all 6 registration tests

I documented the results

I understand what each test was checking

CURL Quick Reference
# GET request
curl http://localhost:3000/api/endpoint

# POST request with JSON
curl -X POST http://localhost:3000/api/endpoint \
-H "Content-Type: application/json" \
-d '{"key": "value"}'

# With Auth Token
curl http://localhost:3000/api/endpoint \
-H "Authorization: Bearer YOUR_TOKEN_HERE"

# See response headers
curl -i http://localhost:3000/api/endpoint

# See just status code
curl -o /dev/null -s -w "%{http_code}" http://localhost:3000/api

Status Codes Cheatsheet
Code	Meaning
200	OK
201	Created
400	Bad Request
401	Unauthorized
403	Forbidden
404	Not Found
409	Conflict
500	Server Error

1. Why is the password mismatch bug dangerous?
   Your answer: I didn't include confirm password in my schema and logic

2. Why should we hide stack traces in production?
   Your answer: It will tell hacker what are the project structure and they can use it for there own benefits

3. What status code should "duplicate email" return?
   a) 400 Bad Request
   b) 401 Unauthorized  
   c) 409 Conflict
   d) 500 Internal Error
   Your answer: b) 401 Unauthorized  

4. Where does YOUR validation logic run?
   (middleware / controller / service)
   Your answer: middleware

   # Level 2 Test Results
**Tester:** [Your Name]
**Date:** [Today's Date]
**Server:** http://localhost:5001

---

## Section 1: Registration

| Test ID | Description | Expected | Actual Status | Result |
|---------|-------------|----------|---------------|--------|
| 1.1 | Register new user | 201    |               |{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjN2EyOTY3ZS1iMjg4LTQ5OTEtYTg4Mi0wMjVkMjEwOGNmNDAiLCJyb2xlIjoiUFJPVklERVIiLCJpYXQiOjE3NjgzMjg4ODIsImV4cCI6MTc2ODkzMzY4Mn0.13m1Nea1gMatsJkq7REbCEA_TiS8Qg0Md6NG5H1SbVo",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjN2EyOTY3ZS1iMjg4LTQ5OTEtYTg4Mi0wMjVkMjEwOGNmNDAiLCJyb2xlIjoiUFJPVklERVIiLCJpYXQiOjE3NjgzMjg4ODIsImV4cCI6MTc3MDkyMDg4Mn0.E2D9xB2g4qYRTsg2VarSj7NIIKoGalpYB0SqFWy3Pnk"
    },
    "user": {
      "id": "c7a2967e-b288-4991-a882-025d2108cf40",
      "email": "level2test@example.com",
      "phoneNumber": null,
      "role": "PROVIDER",
      "isVerified": false
    },
    "hasProvider": false
  }
}|

---

## Section 2: Login Tests

| Test ID | Description | Expected | Actual Status | Result |
|---------|-------------|----------|---------------|--------|
| 2.1 | Valid credentials | 200 | 200 |{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjN2EyOTY3ZS1iMjg4LTQ5OTEtYTg4Mi0wMjVkMjEwOGNmNDAiLCJyb2xlIjoiUFJPVklERVIiLCJpYXQiOjE3NjgzMjkxOTEsImV4cCI6MTc2ODkzMzk5MX0.F6LcjxpTgca-eltDHc_eJRNTfpXdjh6-nwqgiumtgtE",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjN2EyOTY3ZS1iMjg4LTQ5OTEtYTg4Mi0wMjVkMjEwOGNmNDAiLCJyb2xlIjoiUFJPVklERVIiLCJpYXQiOjE3NjgzMjkxOTEsImV4cCI6MTc3MDkyMTE5MX0.nNRzJ2_A5LQUrI-iUdD9i3ZR__kStigxw0MXBddTYbc"
    },
    "user": {
      "id": "c7a2967e-b288-4991-a882-025d2108cf40",
      "email": "level2test@example.com",
      "phoneNumber": null,
      "role": "PROVIDER",
      "isVerified": false
    },
    "hasProvider": false
  }
} |
| 2.2 | Wrong password | 401 | 500 |{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Invalid email or password",
    "stack": "Error: Invalid email or password\n    at AuthService.loginWithEmail (/Users/Admin/Documents/craftconnect/apps/api/src/services/auth.service.ts:114:13)\n    at loginWithEmail (/Users/Admin/Documents/craftconnect/apps/api/src/controllers/auth.controller.ts:66:22)"
  }
} |
| 2.3 | Non-existent email | 401 | 500|{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Invalid email or password",
    "stack": "Error: Invalid email or password\n    at AuthService.loginWithEmail (/Users/Admin/Documents/craftconnect/apps/api/src/services/auth.service.ts:103:13)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at loginWithEmail (/Users/Admin/Documents/craftconnect/apps/api/src/controllers/auth.controller.ts:66:22)"
  }
} |
| 2.4 | Invalid email format | 400/422 |500 | {
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Validation failed",
    "stack": "Error: Validation failed\n    at <anonymous> (/Users/Admin/Documents/craftconnect/apps/api/src/middleware/validate.middleware.ts:56:14)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
  }
}|
| 2.5 | Missing password | 400/422 | 500|{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Too many login attempts. Please try again in 8 minutes.",
    "stack": "Error: Too many login attempts. Please try again in 8 minutes.\n    at authRateLimiter (/Users/Admin/Documents/craftconnect/apps/api/src/middleware/rateLimiter.middleware.ts:136:11)\n    at Layer.handle [as handle_request] (/Users/Admin/Documents/craftconnect/node_modules/express/lib/router/layer.js:95:5)\n    at next (/Users/Admin/Documents/craftconnect/node_modules/express/lib/router/route.js:149:13)\n    at Route.dispatch (/Users/Admin/Documents/craftconnect/node_modules/express/lib/router/route.js:119:3)\n    at Layer.handle [as handle_request] (/Users/Admin/Documents/craftconnect/node_modules/express/lib/router/layer.js:95:5)\n    at /Users/Admin/Documents/craftconnect/node_modules/express/lib/router/index.js:284:15\n    at Function.process_params (/Users/Admin/Documents/craftconnect/node_modules/express/lib/router/index.js:346:12)\n    at next (/Users/Admin/Documents/craftconnect/node_modules/express/lib/router/index.js:280:10)\n    at Function.handle (/Users/Admin/Documents/craftconnect/node_modules/express/lib/router/index.js:175:3)\n    at router (/Users/Admin/Documents/craftconnect/node_modules/express/lib/router/index.js:47:12)"
  }
} |
| 2.6 | Empty body | 400/422 |500 |{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Too many login attempts. Please try again in 7 minutes.",
    "stack": "Error: Too many login attempts. Please try again in 7 minutes.\n    at authRateLimiter (/Users/Admin/Documents/craftconnect/apps/api/src/middleware/rateLimiter.middleware.ts:136:11)\n    at Layer.handle [as handle_request] (/Users/Admin/Documents/craftconnect/node_modules/express/lib/router/layer.js:95:5)\n    at next (/Users/Admin/Documents/craftconnect/node_modules/express/lib/router/route.js:149:13)\n    at Route.dispatch (/Users/Admin/Documents/craftconnect/node_modules/express/lib/router/route.js:119:3)\n    at Layer.handle [as handle_request] (/Users/Admin/Documents/craftconnect/node_modules/express/lib/router/layer.js:95:5)\n    at /Users/Admin/Documents/craftconnect/node_modules/express/lib/router/index.js:284:15\n    at Function.process_params (/Users/Admin/Documents/craftconnect/node_modules/express/lib/router/index.js:346:12)\n    at next (/Users/Admin/Documents/craftconnect/node_modules/express/lib/router/index.js:280:10)\n    at Function.handle (/Users/Admin/Documents/craftconnect/node_modules/express/lib/router/index.js:175:3)\n    at router (/Users/Admin/Documents/craftconnect/node_modules/express/lib/router/index.js:47:12)"
  }
} |

---

## Section 3: Protected Routes

| Test ID | Description | Expected | Actual Status | Result |
|---------|-------------|----------|---------------|--------|
| 3.1 | With valid token | 200/404* | | |
| 3.2 | Without token | 401 | | |
| 3.3 | Invalid token | 401 | | |
| 3.4 | Malformed header | 401 | | |
| 3.5 | Wrong scheme (Basic) | 401 | | |

*Note: 404 is OK if no provider profile exists yet

---

## Section 4: Token Refresh

| Test ID | Description | Expected | Actual Status | Result |
|---------|-------------|----------|---------------|--------|
| 4.1 | Valid refresh token | 200 | | |
| 4.2 | Invalid refresh token | 401 | | |
| 4.3 | Missing token | 400/422 | | |
| 4.4 | Empty string token | 400/422 | | |

---

## Section 5: Logout

| Test ID | Description | Expected | Actual Status | Result |
|---------|-------------|----------|---------------|--------|
| 5.1 | Valid logout | 200 | | |
| 5.2 | Without token | 401 | | |
| 5.3 | Token after logout | 401 | | |

---

## Section 6: Get Current User

| Test ID | Description | Expected | Actual Status | Result |
|---------|-------------|----------|---------------|--------|
| 6.1 | With token | 200 | | |
| 6.2 | Without token | 401 | | |

---

## Summary

- **Total Tests:** 17
- **Passed:** 
- **Failed:** 
- **Pass Rate:** %

---

## Bugs/Issues Found

1. 

2. 

3. 

---

## Notes & Observations

-

-

-