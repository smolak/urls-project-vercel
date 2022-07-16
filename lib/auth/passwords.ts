import argon2 from "argon2";

export async function hashPassword(password: string) {
  return await argon2.hash(password);
}

export async function verifyPassword(hashedPassword: string, password: string) {
  return await argon2.verify(hashedPassword, password);
}
