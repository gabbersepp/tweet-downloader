export default interface Tweet {
    id: BigInt;
    fullText: string;
    createdAt: string;
    mediaUrl: string;
    hashtags: string[];
    localPath?: string;
}