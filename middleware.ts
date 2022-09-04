export { default } from "next-auth/middleware";

// Pages that will require being logged in and redirect to login page if not
// That does not include pages that might require being logged in (e.g. administration page,
// whatever the path will be), but you don't want to be redirected, to indicate that
// such a page exists.
export const config = { matcher: ["/profile", "/url/add"] };
