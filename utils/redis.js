import {createClient} from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.r = createClient();
    this.getClient = promisify(this.r.get).bind(this.r);
  };

  connect() {
    return new Promise((res, rej) => {
      this.r.on('ready', () => {
        res();
      });
  
      this.r.on('error', (err) => {
        rej(Error(`Redis client not connected to the server: ${err}`));
      });
    });
  };

  isAlive = () => {
    try {
      this.connect();
      return true;
    } catch {
      return false;
    }
  };

  async get(key) {
    if (this.isAlive() == true) {
      const value_stored = await this.getClient(key);
      return value_stored;
    }
  };

  async set(key, value, duration) {
    if (this.isAlive() == true) {
      this.r.setex(key, duration, value);
    }
  };

  async del(key) {
    if (this.isAlive() == true) {
      this.r.del(key);
    }
  };
};

const redisClient = new RedisClient();
export default redisClient;
