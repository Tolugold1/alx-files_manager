import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';

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
        if (resp != null) {
          const random_token = uuidv4();
          const key = `auth_${random_token}`;
          const id = String(resp._id);
          redisClient.set(key, id, 86400);
          const user_id = redisClient.get(key);
          return res.status(200).send({ 'token': random_token });
        } else {
          return res.status(401).send({error: 'Unauthorized'});
        }
      });
    };
  };

  static async getDisconnect(req, res) {
    const k = req.get('X-Token');
    const key = `auth_${k}`;
    const user_id = await redisClient.get(key);
    if (user_id !== null) {
      dbClient.db.collection('users').findOne({_id: new ObjectId(user_id)})
      .then(resp => {
        if (resp !== null) {
          redisClient.del(key);
          return res.status(204);
        } else {
          return res.status(401).send({error: 'Unauthorized'});
        }
      });
    } else {
      const err = new Error('No user found');
      err.status = 404;
      return res.status(err.status).send({error: err});
    }
  };
};

export default AuthController;
