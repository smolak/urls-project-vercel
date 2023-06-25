// expect is there, but the types do not see it (or are poorly prepared :/)
// @ts-ignore
import { expect } from "vitest";

// @ts-ignore
import * as matchers from "jest-extended";

expect.extend(matchers);
