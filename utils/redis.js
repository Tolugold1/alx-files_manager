import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.r = redis.createClient();
    this.getClient = promisify(this.r.get).bind(this.r);
    this.r.on('error', err => {
      console.log(`Redis client not connected to the server: ${err.message}`);
    });
  }

  isAlive = () => {
    return this.r.connected;
  };

  async get(key) {
    const value_stored = await this.getClient(key);
    return value_stored;
  };

  async set(key, value, duration) {
    this.r.set(key, value, {
      EX: duration
    });
  };

  async del(key) {
    this.r.del(key);
  };
};

const redisClient = new RedisClient();
export default redisClient;
