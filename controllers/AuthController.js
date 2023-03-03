import dbClient from "../utils/db";
import redisClient from "../utils/redis";
const uuid = require('uuidv4');

class AuthController {
  static async getConnect(req, res) {
    if (req.headers.authorization) {
      const auth = req.headers.authorization.split(' ')[1];
      const decode_auth = new Buffer(auth, 'base64').toString();
      const email = decode_auth.split(':')[0];
      const password = decode_auth.split(':')[1];

      dbClient.db.collection('users').findOne({email: email}, (err, user) => {
        if (err) {
          return res.status(400).send({error: 'err'});
        }
        if (user) {
          const stored_pwd = new Buffer(user.password).toString();
          if (password === stored_pwd) {
            const random_token = uuid();
            const key = `auth_${random_token}`;
            redisClient.set(key, user._id, 60 * 60 * 24);
            return res.status(200).send({ "token": random_token });
          } else {
            return res.status(401).send({error: 'Incorrect password'});
          }
        } else if (user == null) {
          return res.status(401).send({error: 'Unauthorized'});
        }
      })
    }
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
