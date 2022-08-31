# Ideas

1. urlshare.me ????
2. See if I can bring back path aliases I had in tsconfig.json which I had to remove as the ts-node (used for running seed.ts) did not understand those aliases, as if it did not use the tsconfig.json configuration. Possible solution is to double that configuration part both in tsconfig.json and package.json OR see what Google has to say about that.
3. What to do when I already have a URL on my list? Should I add it again? I guess Yes.
4. When URL is created and URL already exists (hash) and the update date is longer than (???) fetch the metadata again, to update it.
5. Optimization for url queue:
   - before adding url to queue check if there's a successful url (SUCCESS state) in the queue
   - if it is - use the metadata from it, don't fetch it afresh
   - it can be used if a URL is popular and many people are adding it
   - such item in the queue would live for e.g. a week, then some cron job would remove SUCCESS ones that are at least a week old
6. Consider having events aggregator trigger events as http calls, to have a separate process running the scripts, not the one that triggered them
   - perhaps passing type `async` or `sync` would distinguish how they are called (or even `softsync` where a call is triggered in same process but it's fire and forget)
