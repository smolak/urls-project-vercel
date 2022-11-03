import { expect, Mock } from "vitest";

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledAfter(mock: Mock): R;
    }
  }
}

expect.extend({
  toHaveBeenCalledAfter: (received: Mock, expected: Mock) => {
    if (received.mock.invocationCallOrder < expected.mock.invocationCallOrder) {
      return {
        message: () => `expected ${received.getMockName()} to have been called after ${expected.getMockName()}.`,
        pass: false,
      };
    }

    return {
      message: () => "",
      pass: true,
    };
  },
});
