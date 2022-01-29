import { createClient } from "redis";
import Crawler from "@/Crawler";

const {
  SEARCHER_BASE_URL = "http://localhost:8000",
  NODE_ENV = "development",
} = process.env;

const redisActionKey = (key: string): string => `birdybop:${NODE_ENV}:action:${key}`;

const redis = createClient();
const pubsub = redis.duplicate();

redis.on("error", console.error);
pubsub.on("error", console.error);

const queuedSubscribe = (key: string, callback: (value: string) => void): void => {
  pubsub.subscribe(redisActionKey(key), (queue) => {
    redis.lPop(queue).then((value) => {
      // If the value is null/undefined that means it's been picked up by
      // another crawler process, so we can bail.
      if (value !== null && typeof value !== "undefined") callback(value);
    });
  });
};

Promise.all([
  redis.connect(),
  pubsub.connect(),
]).then(() => {
  queuedSubscribe("source:crawl", (baseUrl) => {
    const crawler = new Crawler({ baseUrl, searcherBaseUrl: SEARCHER_BASE_URL});
    crawler.start();
  });
});
