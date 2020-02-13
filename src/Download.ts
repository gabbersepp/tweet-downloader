import request from "request";
import * as fs from "fs";
import * as path from "path";

export function download(imageUrl: string, tweetId: string, targetDir: string): Promise<string> {
    const ext = imageUrl.split("\.").reverse()[0];
   
    return new Promise(resolve => {
        const targetPath = path.join(targetDir, `${tweetId}.${ext}`);
        const stream = fs.createWriteStream(targetPath);
        request(imageUrl).pipe(stream);
        stream.on("finish", () => resolve(targetPath));
    });
}