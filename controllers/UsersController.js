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

      dbClient.db.collection('users').insertOne(newUser)
      .then(resp => {
        dbClient.db.collection('users').findOne({email: req.body.email})
        .then(resp => {
          return res.status(201).send({email: resp.email, id: resp._id});
        });
      }).catch (err => (res.status(err.status).send({'error': err,})))
    } catch (error) {
      return res.status(500).send({error: 'Server error'})
    }
  }

  static async getMe(req, res) {
    const k = req.headers['X-Token'];
    const key = `auth_${k}`;
    const user_id = redisClient.get(key);
    if (user_id != {}) {
      dbClient.db.collection('users').findOne({_id: user_id})
      .then(resp => {
        if (resp != {}) {
          return res.status(200).send({id: user_id, email: resp})
        } else {
          return res.status(err.status).send({error: err});
        }
      });
    } else {
      return res.status(401).send({error: 'Unauthorized'});
    }
  }
};

export default UsersController;
