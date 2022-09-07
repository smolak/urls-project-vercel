import { customAlphabet } from "nanoid";

const ALPHABET = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ1234567890_";

export const generateId = (prefix = "") => `${prefix}${customAlphabet(ALPHABET)()}`;
