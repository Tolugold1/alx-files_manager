import redisClient from "../utils/redis";
import dbClient from "../utils/db";

class AppController {
  static getStatus(req, res) {
    const status = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive()
    }
    res.statusCode = 200;
    res.send(status)
  };

  static async getStats(req, res) {
    const stat = {
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles()
    }

    res.statusCode = 200;
    res.send(stat)
  }
}

export default AppController;