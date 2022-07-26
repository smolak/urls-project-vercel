# TODOs

 - [] refresh jwt token, session when apiKey is changed (so that they're stored there)
 - [] Have name required, also add unique username (aka handle, like in Twitter, @jacek)
 - [] Add global salt and per user salt for passwords
 - [] Add callbackUrl validation against malicious URLs (only in domain allowed OR paths)
   - [] Perhaps a path can be set rather than a URL?
 - [] Add email verification
 - [] Password strength validation
   - [] Password strength validation visualisation (weak, strong, very strong ...)
 - [] Perhaps addMany handling in generateModelId middleware would be needed
