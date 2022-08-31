// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import * as matchers from "jest-extended";

expect.extend(matchers);

const generateRandomString = () => (Math.random() + 1).toString(36).substring(2);

jest.mock("nanoid", () => ({
  customAlphabet: () => jest.fn().mockReturnValue(generateRandomString()),
}));

global.console = {
  ...console,
  // log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
