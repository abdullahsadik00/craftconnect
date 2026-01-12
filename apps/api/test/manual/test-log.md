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