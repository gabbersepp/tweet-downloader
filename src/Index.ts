import Twitter from "twitter-lite";
import * as fs from "fs";
import { download } from "./Download";
import * as path from "path";
import Tweet from "./contracts/Tweet";

export async function getSpecificTweets(tweetids: string[], imageTargetDir: string,
    TWTR_CKEY: string, TWTR_CSECRET: string, TWTR_ATOKEN: string, TWTR_ASECRET: string) {
    
    const client = new Twitter({
        subdomain: "api",
        consumer_key: TWTR_CKEY,
        consumer_secret: TWTR_CSECRET,
        access_token_key: TWTR_ATOKEN,
        access_token_secret: TWTR_ASECRET
    });
    
    const timeline: any[] = [];

    for (var i = 0; i < tweetids.length; i++) {
        const tweetId = tweetids[i];
        timeline[i] = await client.get(`statuses/show/${tweetId}`, {
            tweet_mode: "extended"
        });
    }

    return processExtendedTweets(imageTargetDir, timeline);
}

export async function getLatestTweets(latestTweetId: string, screenName: string, imageTargetDir: string,
    TWTR_CKEY: string, TWTR_CSECRET: string, TWTR_ATOKEN: string, TWTR_ASECRET: string, maxCount: number) {

    const client = new Twitter({
        subdomain: "api",
        consumer_key: TWTR_CKEY,
        consumer_secret: TWTR_CSECRET,
        access_token_key: TWTR_ATOKEN,
        access_token_secret: TWTR_ASECRET
    });

    let timeline: any[];
    
    timeline = await client.get("statuses/user_timeline", {
        screen_name: screenName,
        exclude_replies: true,
        include_rts: false,
        tweet_mode: "extended",
        count: maxCount,
        since_id: latestTweetId
    });

    for (var i = 0; i < timeline.length; i++) {
        let tweet = timeline[i];
        timeline[i] = await client.get(`statuses/show/${tweet.id_str}`, {
            tweet_mode: "extended"
        });
    }

    return processExtendedTweets(imageTargetDir, timeline);
}

export function mergeAndWriteWithExisting(tweetJsonPath: string, newTweets: Tweet[]): Tweet[] {
    const hashMap: any = {};

    [...readTweets(tweetJsonPath), ...newTweets].map(t => {
        const newTweet = newTweets.find(x => x.id == t.id);
        return newTweet || t; 
    })
    // filter out duplicates
    .forEach((t: Tweet) => {
        hashMap[t.id.toString()] = t;
    });

    let sortedTweets = Object.keys(hashMap).map(x => hashMap[x])
        .map(x => {
            x.id = BigInt(x.id)
            return x;
        })
        .sort((a, b) => a.id < b.id ? 1 : -1);

    const tweetsToStore = sortedTweets.map(x => {
        return {
            ...x,
            id: x.id.toString()
        };
    });

    fs.writeFileSync(tweetJsonPath, JSON.stringify(tweetsToStore));
    return sortedTweets;
}

export function readTweets(tweetJsonPath: string): Tweet[] {
    if (fs.existsSync(tweetJsonPath)) {
        return JSON.parse(fs.readFileSync(tweetJsonPath).toString()).map((x: Tweet) => {
            x.id = BigInt(x.id);
            return x;        
        });
    }

    return [];
}

async function processExtendedTweets(imageTargetDir: string, tweets: any[]) {
    
    let partsCombined = "";

    imageTargetDir.split("\.").forEach(part => {
        partsCombined = path.join(partsCombined, part);

        if (!fs.existsSync(partsCombined)) {
            fs.mkdirSync(partsCombined);
        }
    });

    const getHashtags = (x: any) => {
        if (x.entities && x.entities.hashtags) {
            return x.entities.hashtags.map((x: any) => x.text);
        }
        return [];
    }

    const results: Tweet[] = tweets.map((x: any) => ({
        fullText: x.full_text,
        createdAt: x.created_at,
        id: x.id_str,
        mediaUrl: x.extended_entities ? x.extended_entities.media[0].media_url : null,
        hashtags: getHashtags(x),
        likeCount: x.favorite_count,
        retweetCount: x.retweet_count
    }));

    for (var i = 0; i < results.length; i++) {
        const x = results[i];
        if (!x.mediaUrl) {
            continue;
        }
        
        const path = await download(x.mediaUrl, x.id.toString(), imageTargetDir);
        x.localPath = path;
    }

    return results;
}