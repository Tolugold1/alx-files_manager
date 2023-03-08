const { MongoClient } = require('mongodb');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

class DBClient {
  constructor() {
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect()
    .then((conn) => {
      this.db = conn.db(DB_DATABASE);
      this.users = this.db.collection('users');
      this.files = this.db.collection('files');
    }, (err) => {
      console.log(err.message);
      this.db = false;
      return;
    });
  };

  isAlive() {
    return !!this.db;
  };

  async nbUsers() {
    return this.users.countDocuments();
  };

  async nbFiles() {
    const number_of_files = this.files.countDocuments();
    return number_of_files;
  };
};

const dbClient = new DBClient();
export default dbClient;