import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.r = redis.createClient({host: '127.0.0.1', port: 6379});
    this.getClient = promisify(this.r.get).bind(this.r);
    this.r.on('error', err => {
      console.log(`Redis client not connected to the server: ${err.message}`);
    });
  };

  isAlive = () => {
    return this.r.connected;
  };

  async get(key) {
    const value_stored = await this.getClient(key);
    return value_stored;
  };

  async set(key, value, duration) {
    this.r.setex(key, duration, value);
  };

  async del(key) {
    this.r.del(key);
  };
};

const redisClient = new RedisClient();
export default redisClient;
