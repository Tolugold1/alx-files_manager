import { createClient } from "redis";
import {promisify} from 'util';

class RedisClient {

  constructor () {
    this.client = createClient();
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
    if(this.isAlive() == true) {
      const getProm = promisify(this.client.get).bind(this.client);
      let res = await getProm(key);
      return res;
    }
  }

  async set(key, value, duration) {
    if(this.isAlive() == true) {
      const setProm = promisify(this.client.setex).bind(this.client);
      await setProm(key, duration, value);
    }
  }

  async del(key) {
    if(this.isAlive() == true) {
      const delProm = promisify(this.client.del).bind(this.client);
      let res = await(delProm(key));
      return res;
    }
  }
}

const redisClient = new RedisClient();

export default redisClient;
