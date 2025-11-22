import { User } from '../types';

// This is a mock secret key. In a real application, this would be a secure, environment-specific secret.
const JWT_SECRET = 'your-super-secret-key-that-is-not-so-secret';

// The payload of our JWT
interface DecodedToken extends User {
    iat: number;
    exp: number;
}

// Base64 URL encoding/decoding functions
const base64UrlEncode = (str: string) => {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const base64UrlDecode = (str: string) => {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
        case 0:
            break;
        case 2:
            output += '==';
            break;
        case 3:
            output += '=';
            break;
        default:
            throw new Error('Illegal base64url string!');
    }
    return atob(output);
};

// Creates a mock JWT. The signature is not cryptographically secure.
export const createToken = (user: User): string => {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    const payload = {
        ...user,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // Expires in 24 hours
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    
    // In a real app, this signature would be a cryptographic hash (e.g., HMAC-SHA256)
    const mockSignature = base64UrlEncode(`mock-signature-for-${user.id}`);

    return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
};

// Decodes a token and returns its payload. Does not verify the signature.
export const decodeToken = (token: string): DecodedToken | null => {
    try {
        const [, payloadB64] = token.split('.');
        if (!payloadB64) return null;
        const decodedPayload = JSON.parse(base64UrlDecode(payloadB64));
        return decodedPayload as DecodedToken;
    } catch (error) {
        console.error("Failed to decode token", error);
        return null;
    }
};

// Checks if the token is expired.
export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = decodeToken(token);
        if (!decoded || typeof decoded.exp === 'undefined') return true;
        
        // The 'exp' claim is in seconds, Date.now() is in milliseconds.
        return Date.now() >= decoded.exp * 1000;
    } catch (error) {
        return true;
    }
};
