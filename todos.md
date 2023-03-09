# TODOs

1. [] refresh jwt token, session when apiKey is changed (so that they're stored there)
2. [] Have name required, also add unique username (aka handle, like in Twitter, @jacek)
3. [] Add global salt and per user salt for passwords
4. [] Add callbackUrl validation against malicious URLs (only in domain allowed OR paths)
   4.1. [] Perhaps a path can be set rather than a URL?
5. [] Add email verification
6. [] Password strength validation
   6.1.[] Password strength validation visualisation (weak, strong, very strong ...)
7. [] Perhaps addMany handling in generateModelId middleware would be needed
8. [] Move fixtures from test/.. to appropriate libs
9. [] When /[username] is entered, a query for user data is performed that requests apiKey - it should not!
10. [] Follow smart / dumb components pattern. User `container` for smart ones, no suffix for dumb ones (?).
11. [] Change the try again on the user feeds error component:
    - [] the try again is not to redirect but trigger fetching the data again
    - [] extract component - it is used here and there
    - [] store routes somewhere? The `/` is a magic string
12. [] Use one icon module (right now I am using more)
13. Each forbidden status must return JSON, otherwise it will not resolve
