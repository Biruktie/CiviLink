# These are conventions for all API communication 

1. Base path: /api/v1
2. Content-Type: application/json for JSON bodies, multipart/form-data for file uploads.
3. Responses:
```
{
	  "success": true,
	  "data": { ... },
	  "error": null
}

```
4. Errors:
```
{
  "success": false,
  "error": {
    "message": "Email already exists"
  }
}

```
5. Role checks: enforced via RBAC middleware (citizen, officer, admin)
6. Pagination: ?page=1&limit=25
```
Example: GET /posts?limit=25&after_cursor=bv8475h
``` 
7. Date format: ISO 8601 strings
---
# Auth header & cookies
```
•	Use Authorization: Bearer <token> for API clients.

•	Cookies: accessToken (short lived), refreshToken (httpOnly).

•	Refresh flow: POST /api/v1/auth/refresh   reading refresh cookie
```

- Using POST for a refresh token endpoint is the industry standard and best practice for security and semantic reasons. Even though you are technically "getting" a new access token, the operation performs significant actions on the server.
