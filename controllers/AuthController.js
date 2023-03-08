import dbClient from "../utils/db";
import redisClient from "../utils/redis";
import { v4 as uuidv4 } from 'uuid';

const sha1 = require('sha1');

class AuthController {
  static async getConnect(req, res) {
    if (req.headers.authorization) {
      const auth = req.headers.authorization.split(' ')[1];
      const decode_auth = new Buffer(auth, 'base64').toString();
      const email = decode_auth.split(':')[0];
      const password = decode_auth.split(':')[1];
      const hashpwd = sha1(password)
      dbClient.db.collection('users').findOne({email: email, password: hashpwd})
      .then(resp => {
        if (resp != {}) {
          const random_token = uuidv4();
          const key = `auth_${random_token}`;
          redisClient.set(key, resp._id, 60 * 60 * 24);
          return res.status(200).send({ "token": random_token });
        } else {
          return res.status(401).send({error: 'Unauthorized'});
        }
      });
    };
  };

  static async getDisconnect(req, res) {
    const k = req.headers.X-Token.split(' ')[1];
    const key = `auth_${k}`;
    const key_value = redisClient.get(key);
    if (key_value.length !== 0) {
      redisClient.del(key);
      return res.status(204);
    } else {
      return res.status(404).send({error: 'Unauthorized'});
    }
  }
};

export default AuthController;
