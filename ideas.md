# Ideas

1. urlshare.me ????
2. See if I can bring back path aliases I had in tsconfig.json which I had to remove as the ts-node (used for running
   seed.ts) did not understand those aliases, as if it did not use the tsconfig.json configuration. Possible solution is
   to double that configuration part both in tsconfig.json and package.json OR see what Google has to say about that.
3. What to do when I already have a URL on my list? Should I add it again? I guess Yes.
4. When URL is created and URL already exists (hash) and the update date is longer than (???) fetch the metadata again,
   to update it.
5. Optimization for url queue:
   - before adding url to queue check if there's a successful url (SUCCESS state) in the queue
   - if it is - use the metadata from it, don't fetch it afresh
   - it can be used if a URL is popular and many people are adding it
   - such item in the queue would live for e.g. a week, then some cron job would remove SUCCESS ones that are at least
     a week old
6. Consider having events aggregator trigger events as http calls, to have a separate process running the scripts, not
   the one that triggered them
   - perhaps passing type `async` or `sync` would distinguish how they are called (or even `softsync` where a call is
     triggered in same process but it's fire and forget)
7. Some URLs won't have title and description (e.g. an image or a link to a .zip file) - those fields can be edited
   later on by the owner of the URL
8. Potential selling point: returning a list of most followed users with at least 'n' added URLs in the past month.
9. Measure how long it takes to add e.g. 1000 urls to FeedQueue or how many I can add in a second, etc.
10. Categories:
    1. Possible categories:
        1. Personal: This category can be used for URLs related to personal interests, hobbies, or private resources. 
        2. Work: Users can use this category to store URLs relevant to their professional life, such as work-related tools, documents, or industry-specific websites. 
        3. Education: This category can be used to store URLs related to educational resources, online courses, research materials, or academic websites. 
        4. News: Users can categorize URLs related to news websites, blogs, or any sources they frequently visit for the latest information. 
        5. Entertainment: This category can include URLs related to movies, TV shows, music, games, or any other form of entertainment. 
        6. Social Media: Users can store URLs for their favorite social media platforms, profiles, or any other relevant links. 
        7. Shopping: This category can be used for URLs related to online shopping websites, e-commerce platforms, or specific products users want to keep track of. 
        8. Travel: Users can store URLs related to travel planning, booking websites, destination guides, or travel blogs. 
        9. Health and Fitness: This category can include URLs for health-related articles, fitness resources, workout routines, or nutritional information. 
        10. Technology: Users can categorize URLs related to technology news, gadget reviews, software downloads, or programming resources.
    2. For the plugin - when the URL exists and is added to some categories, suggest those categories
    3. What if an existing URL is already added to different, not overlapping categories?
    4. 
