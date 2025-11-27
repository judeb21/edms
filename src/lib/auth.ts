import jwt from "jsonwebtoken";

const SECRET = "f57838ece0cfc8210795c9cf843eabecfef8d5d4";

export function signJWT(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: "1d" });
}

export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
