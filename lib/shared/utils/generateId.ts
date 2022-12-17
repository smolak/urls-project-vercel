import { customAlphabet } from "nanoid";

export const ALPHABET = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ1234567890_";

export const generateId = (prefix = "", size = 21) => `${prefix}${customAlphabet(ALPHABET, size)()}`;
