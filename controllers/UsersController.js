import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { ObjectId } from 'mongodb';
const sha1 = require('sha1');

class UsersController {
  static async postNew(req, res) {
    try {
      if (!req.body.email) {
        return res.status(400).send({error: 'Missing email'});
      }
      if (!req.body.password) {
        return res.status(400).send({error: 'Missing password'});
      }
  
      const check_if_email_exit_in_db = await dbClient.db.collection('users').findOne({email: req.body.email});
      if (check_if_email_exit_in_db !== null) {
        return res.status(400).send({error: 'Already exist'});
      }
  
      const hashedPw = sha1(req.body.password);
      const newUser = {
        email: req.body.email,
        password: hashedPw,
      };
  
      dbClient.db.collection('users').insertOne(JSON.stringify(newUser), (err, user) => {
        if (err) {
          return res.status(err.status).send({error: err})
        }
        if (user) {
          return res.status(201).send({id: user._id, email: req.body.email});
        }
      });
    } catch (error) {
      return res.status(500).send({error: 'Server error'})
    }
  }

  static async getMe(req, res) {
    const k = req.headers.X-Token.split(' ')[1];
    const key = `auth_${k}`;
    const user_id = redisClient.get(key);
    if (user_id.length !== 0) {
      dbClient.db.collection('users').findOne({_id: user_id}, (err, user) => {
        if (err) {
          return res.status(err.status).send({error: err});
        }

        if (user) {
          const user_email = user.email;
          return res.status(200).send({id: user_id, email: user_email})
        }
      });
    } else {
      return res.status(401).send({error: 'Unauthorized'});
    }
  }
};

export default UsersController;
