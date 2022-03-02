import * as jwt from "jsonwebtoken";

export const APP_SECRET = "GraphQL-is-aw3some";

export interface AuthTokenPayload {
  // AuthTokenPayload interface is based on the shape of the JWT token that we issued during signup and login. When the server decodes an issued token, it should expect a response in this format.
  userId: number;
}

export function decodeAuthHeader(authHeader: String): AuthTokenPayload {
  // The decodeAuthHeader function takes the Authorization header and parses it to return the payload of the JWT.
  const token = authHeader.replace("Bearer ", ""); // The Authorization header, contains the type or scheme of authorization followed by the token. In our case, "Bearer" represents the authorization scheme. Since the server is only interested in the JWT token itself, you can get rid of the "Bearer" and keep only the token.

  if (!token) {
    throw new Error("No token found");
  }
  return jwt.verify(token, APP_SECRET) as AuthTokenPayload; // The jwt.verify() functions decodes the token. It also needs access to the secret (or a public key) which was used to sign the token.
}
