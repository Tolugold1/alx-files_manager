const { MongoClient } = require('mongodb')

const DB_HOST = process.env.DB_HOST || localhost;
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || files_manager;

class DBClient {
  constructor() {
    const url = `mongodb://${DB_HOST}:${DB_PORT}`;
    const client = new MongoClient(url);
    client.connect()
    .then((err, conn) => {
      if (err) {
        console.log(err.message);
        this.db = false;
        return;
      }

      this.db = conn.db(DB_DATABASE);
      this.user = this.db.collection('users');
      this.files = this.db.collection('files');
    })
  };

  isAlive() {
    if (this.db == false) {
      return false;
    } else {
      return true;
    }
  };

  async nbUsers() {
    const number_of_users = await this.user.count();
    return number_of_users;
  };

  async nbFiles() {
    const number_of_files = await this.files.count();
    return number_of_files;
  };

};

const dbClient = DBClient();
export default dbClient;
