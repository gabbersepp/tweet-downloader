import { getLatestTweets, mergeAndWriteWithExisting } from "../src/Index";

async function start() {
    const result = await getLatestTweets("1", "JosefBiehler", "./test/out", process.env.TWTR_CKEY, process.env.TWTR_CSECRET, process.env.TWTR_ATOKEN, process.env.TWTR_ASECRET);
    mergeAndWriteWithExisting("./test/out/tweets.json", result);
}

    start().catch(e => {
        console.log(e)
    });