import jwt, { JwtPayload } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { Context, Next } from 'hono';
import { AppBindings } from '../types';

// Dynamic Environment ID - get this from https://app.dynamic.xyz/dashboard/developer/api
const DYNAMIC_ENV_ID = process.env.DYNAMIC_ENV_ID || 'a00775da-8e48-4541-a4f8-6385995b62ee';
const jwksUrl = `https://app.dynamic.xyz/api/v0/sdk/${DYNAMIC_ENV_ID}/.well-known/jwks`;

// JWKS client for fetching public keys
const client = new JwksClient({
  jwksUri: jwksUrl,
  rateLimit: true,
  cache: true,
  cacheMaxEntries: 5,  // Maximum number of cached keys
  cacheMaxAge: 600000 // Cache duration in milliseconds (10 minutes)
});

// Function to get the public key for JWT verification
async function getPublicKey(kid: string): Promise<string> {
  const signingKey = await client.getSigningKey(kid);
  return signingKey.getPublicKey();
}

// Extract JWT token from Authorization header
function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  
  // Support both "Bearer token" and "token" formats
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return authHeader;
}

async function verifyToken(encodedJwt: string): Promise<JwtPayload> {
  try {
    // Decode JWT header to get the kid
    const header = jwt.decode(encodedJwt, { complete: true })?.header;
    if (!header || !header.kid) {
      throw new Error('JWT header missing or no kid found');
    }
    
    const publicKey = await getPublicKey(header.kid);
    
    const decodedToken = jwt.verify(encodedJwt, publicKey, {
      ignoreExpiration: false,
    }) as JwtPayload;

    // Check for additional authentication requirements
    if (decodedToken.scopes && decodedToken.scopes.includes('requiresAdditionalAuth')) {
      throw new Error('Additional verification required');
    }

    return decodedToken;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    }
    throw error;
  }
}

export function authenticateDynamic() {
  return async (c: Context<AppBindings>, next: Next) => {
    try {
      const authHeader = c.req.header('x-dynamic-access-token');
      const token = extractToken(authHeader);

      if (!token) {
        return c.json({ error: 'Authorization token required' }, 401);
      }

      const decodedToken = await verifyToken(token);

    
      // Attach user to context
      c.set('dynamicUserId', decodedToken.sub || decodedToken.id);
      
      await next();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      return c.json({ message, success: false, data: null }, 401);
    }
  };
}





