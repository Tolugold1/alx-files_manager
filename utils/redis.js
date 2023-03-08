import {createClient} from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.r = createClient();
    this.getClient = promisify(this.r.get).bind(this.r);
    this.on('error', (err) => {
      console.log(err);
    });
  };

  connect() {
    return new Promise((res, rej) => {
      this.r.once('ready', () => {
        res();
      });
  
      this.r.once('error', (err) => {
        rej(err);
      });
    });
  };

  isAlive = () => {
    if (this.r.connected == true) {
      return true;
    }
    try {
      this.connect();
      return true;
    } catch (err) {
      console.log(`Redis client not connected to the server: ${err}`)
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
