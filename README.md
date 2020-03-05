[![NPM](https://img.shields.io/npm/v/tweet-downloader.svg)](https://www.npmjs.com/package/tweet-downloader)

# Tweet downloader

Download all of your tweets including its' attached images with just one function call. 

# Usage

>npm install -D tweet-downloader

Ensure that you have a Twitter Developer account an created an app. You will need the credentials.

Simply call:
```js
getLatestTweets("1", "KackDev", "./images", ....)
```

If you want all tweets, just pass "1" here. "0" will not work.

