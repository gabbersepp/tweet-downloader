import Twitter from "twitter-lite";
import * as fs from "fs";
import { download } from "./Download";

export async function getLatestEarningsPost(latestTweetId: string, screenName: string, targetDir: string,
    TWTR_CKEY: string, TWTR_CSECRET: string, TWTR_ATOKEN: string, TWTR_ASECRET: string) {

    const client = new Twitter({
        subdomain: "api",
        consumer_key: TWTR_CKEY,
        consumer_secret: TWTR_CSECRET,
        access_token_key: TWTR_ATOKEN,
        access_token_secret: TWTR_ASECRET
    });

    let timeline;
    
    timeline = await client.get("statuses/user_timeline", {
        screen_name: screenName,
        exclude_replies: true,
        include_rts: false,
        tweet_mode: "extended",
        count: 5,
        since_id: latestTweetId
    });

    for (var i = 0; i < timeline.length; i++) {
        let tweet = timeline[i];
        timeline[i] = await client.get(`statuses/show/${tweet.id_str}`, {
            tweet_mode: "extended"
        });
    }

    const getHashtags = (x: any) => {
        if (x.entities && x.entities.hashtags) {
            return x.entities.hashtags.map((x: any) => x.text);
        }
        return [];
    }

    const results = timeline.map((x: any) => ({
        fullText: x.full_text,
        createdAt: x.created_at,
        id: x.id_str,
        mediaUrl: x.extended_entities ? x.extended_entities.media[0].media_url : null,
        hashtags: getHashtags(x)
    }));

    for (var i = 0; i < results.length; i++) {
        const x = results[i];
        if (!x.mediaUrl) {
            continue;
        }
        
        const path = await download(x.mediaUrl, x.id, targetDir);
        x.localPath = path;
    }

    return results;
}

export function mergeAndWriteWithExisting(tweetJsonPath: string, newTweets: any[]): any[] {
    const sortedTweets = [...readTweets(tweetJsonPath), ...newTweets]
        .map(x => {
            x.id = BigInt(x.id)
            return x;
        })
        .sort((a, b) => a.id < b.id ? 1 : -1)
        .map(x => {
            x.id = x.id.toString();
            return x;
        });
    fs.writeFileSync(tweetJsonPath, JSON.stringify(sortedTweets));
    return sortedTweets;
}

export function readTweets(tweetJsonPath: string): any[] {
    if (fs.existsSync(tweetJsonPath)) {
        return JSON.parse(fs.readFileSync(tweetJsonPath).toString()).map((x: any) => {
            x.id = BigInt(x.id);
            return x;        
        });
    }

    return [];
}