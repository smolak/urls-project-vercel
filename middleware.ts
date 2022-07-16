export { default } from "next-auth/middleware";

// Pages that will require being logged in:
export const config = { matcher: ["/"] };
