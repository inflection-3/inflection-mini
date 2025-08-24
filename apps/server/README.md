# Server with Dynamic Authentication

This server uses the `@dynamic-labs/passport-dynamic` strategy for authentication with Dynamic.xyz.

## Setup

1. **Install dependencies** (already done):
   ```bash
   bun add @dynamic-labs/passport-dynamic passport @types/passport
   ```

2. **Configure Dynamic public key**:
   Create a `.env` file in the server directory with:
   ```env
   DYNAMIC_PUBLIC_KEY="your_actual_dynamic_public_key_here"
   ```

   The public key should be a valid PEM-formatted RSA public key from Dynamic.xyz.

## Usage

### Protected Routes
Use the `authenticateDynamic()` middleware to protect routes:

```typescript
import { authenticateDynamic, getUser } from "../services/dynamic";

// Protected route
indexRoute.get("/profile", authenticateDynamic(), (c) => {
  const user = getUser(c);
  return c.json({ user });
});
```

### Accessing User Data
The authenticated user is available in the context:

```typescript
const user = getUser(c);
// user.id - User ID
// user.email - User email
// user.dynamicUserId - Dynamic user ID (from sub/id)
// user.scopes - User scopes/permissions
```

### Scope Checking
Check user permissions using the utility functions:

```typescript
import { hasScope, hasAnyScope, hasAllScopes } from "../services/dynamic";

if (hasScope(user, 'admin')) {
  // User has admin scope
}

if (hasAnyScope(user, ['read', 'write'])) {
  // User has at least one of these scopes
}
```

### MFA Handling
The strategy automatically handles MFA requirements by checking for the `requiresAdditionalAuth` scope. If present, authentication will fail.

## Example API Endpoints

- `GET /api/` - Public welcome message
- `GET /api/profile` - Protected profile endpoint (requires valid Dynamic token)
- `GET /api/admin` - Admin endpoint (requires admin scope)

## Testing

To test authentication, send a request with the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_DYNAMIC_JWT_TOKEN" http://localhost:3000/api/profile
```

The JWT token should be obtained from the Dynamic SDK's `authToken` method.
