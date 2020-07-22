import { getSpecificTweets, getLatestTweets, mergeAndWriteWithExisting } from "../src/Index";

async function start() {
    let result = await getLatestTweets("1", "JosefBiehler", "./test/out", process.env.TWTR_CKEY, process.env.TWTR_CSECRET, process.env.TWTR_ATOKEN, process.env.TWTR_ASECRET, 5);
    result = await getSpecificTweets(["1283432908397699072"], "./test/out", process.env.TWTR_CKEY, process.env.TWTR_CSECRET, process.env.TWTR_ATOKEN, process.env.TWTR_ASECRET);
    mergeAndWriteWithExisting("./test/out/tweets.json", result);
}

    start().catch(e => {
        console.log(e)
    });