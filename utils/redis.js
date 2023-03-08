import { createClient } from "redis";
import {promisify} from 'util';

class RedisClient {

  constructor () {
    this.client = createClient();
    this.getClient = promisify(this.client.get).bind(this.client);
    this.client.on('error', (err) => {
      console.log(err);
    })
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.client.once('ready', () => {
        resolve();
      });

      this.client.once('error', (error) => {
        reject(error);
      });
    });
  }

  isAlive () {
    if(this.client.connected == true) {
      return true;
    }
    try {
      this.connect();
      return true;
    } catch (error) {
      console.error('Error connecting to Redis:', error);
      return false;
    }
  }

  async get(key) {
    if (this.isAlive() == true) {
      return this.getClient(key);
    }
  }

  async set(key, value, duration) {
    if(this.isAlive() == true) {
      this.client.setex(key, duration, value);
    }
  }

  async del(key) {
    if(this.isAlive() == true) {
      let res = this.client.del(key);
      return res;
    }
  }
}

const redisClient = new RedisClient();

export default redisClient;