# Tweet Downloader

[![NPM](https://img.shields.io/npm/v/tweet-downloader.svg)](https://www.npmjs.com/package/tweet-downloader)

Download all of your tweets including its' attached images with just one function call. 

## Installation

```
npm install -D tweet-downloader
```

## Additional Steps

To use this tool you have to create a Twitter Developer account and get an access token.

## Objects

**Tweet**:
```js
    {
        id: BigInt;
        fullText: string;
        createdAt: string;
        mediaUrl: string;
        hashtags: string[];
        localPath?: string;
    }
```

## Methods

```js
    // read and parse tweets from local json file
    readTweets(tweetJsonPath: string): Tweet[]
    // merge new tweets into already existing json file
    mergeAndWriteWithExisting(tweetJsonPath: string, newTweets: Tweet[]): Tweet[]
    // get all tweets since 'latestTweetId' ordered by date descending
    getLatestTweets(latestTweetId: string, screenName: string, imageTargetDir: string,
        TWTR_CKEY: string, TWTR_CSECRET: string, TWTR_ATOKEN: string, TWTR_ASECRET: string, maxCount: number): Promise<Tweet[]>
    // get only specific tweets
    getSpecificTweets(tweetids: string[], imageTargetDir: string,
        TWTR_CKEY: string, TWTR_CSECRET: string, TWTR_ATOKEN: string, TWTR_ASECRET: string): Promise<Tweet[]>
```

## Usage

```js
    getLatestTweets("1", "KackDev", "./images", <your twitter credentials>)
```

## Hints

* If you want all tweets, just pass "1" as first parameter in `getLatestTweets`. "0" will not work
* The max value for `maxCount` is 200 
* Twitter will deliver only the 200 newest tweets

