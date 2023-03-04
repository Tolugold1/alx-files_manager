import UsersController from "./UsersController";
import dbClient from "../utils/db";
const mime = require('mime-types')
const fs = require('fs');

class FilesController {
  static async postUpload(req, res) {
    try {
      await UsersController.getMe(req, res)
      .then(user => {
        if (user) {
          const name = req.body.name;
          const type = req.body.type;
          const parentId = req.body.parentId || 0;
          const isPublic = req.body.isPublic || false;
          const data = req.file;
          const userId = user.id;

          if (!name) {
            return res.status(400).send({error: 'Missing name'});
          }

          const validType = [ 'folder', 'file', 'image'];
          if (!type || validType.indexOf(type) === -1) {
            return res.status(400).send({error: 'Missing type'});
          }

          if (!data && type !== 'folder') {
            return res.status(400).send({error: 'Missing data'});
          }

          if (parentId != 0) {
            const parent_file = dbClient.db.collection('files').findOne({parentId: parentId});
            if (!parent_file) {
              return res.status(400).send({error: 'Parent not found'});
            } else {
              if (parent_file.type !== 'folder') {
                return res.status(400).send({error: 'Parent is not a folder'});
              }
            }
          }
          const filePath = fs.readFileSync(req.file.path);

          const doc = {
            userId: userId,
            name: name,
            type: type,
            parentId: parentId,
            isPublic: isPublic,
            data: {
              data: filePath,
              contentType: mime.contentType(path.extname(filePath))
            }
          };

          if (type == 'folder') {
            dbClient.db.collection('files').insertOne(JSON.stringify(doc));
            const new_Doc = dbClient.db.collection('files').findOne({parentId: parentId});
            return res.status(201).send(new_Doc);
          } else {
            const local_file_path = process.env.FOLDER_PATH || '/tmp/files_manager';
            if (!fs.existsSync(local_file_path)) {
              fs.mkdirSync(local_file_path);
              const content = filePath.toString('base64');

              const doc = {
                userId: userId,
                name: name,
                type: type,
                isPublic: isPublic,
                parentId: parentId,
                localPath: local_file_path
              };
              const k = req.headers.X-Token.split(' ')[1];
              fs.writeFile(local_file_path + `/${k}`, content);
              dbClient.db.collection('files').insertOne(JSON.stringify(doc));
              return res.status(201).send(JSON.stringify(doc));
            }
          }
        }
      })
      
    } catch (error) {
      return res.status(401).send({error: 'Unauthorized'});
    }
  }

  static async getShow(req, res) {
    try {
      await UsersController.getMe(req, res)
      .then(user => { 
        if (user) {
          const user_file = dbClient.db.collection('files').findOne({userId: req.params.id});
          if (!user_file) {
            return res.status(404).send({error: 'Not found'});
          } else {
            return res.status(200).send(user_file);
          }
        }
      }).catch(err => console.log(err));
    } catch (error) {
      return res.status(401).send({error: 'Unauthorized'});
    }
  };

  static async getIndex(req, res) {
    try {
      await UsersController.getMe(req, res)
      .then(user => {
        if (user) {
          dbClient.db.collection('files').aggregate([
            {$match: {parentId: req.body.parentId}}, {$skip: req.body.page * 19}, {$limit: 19}
          ])
          .then((full_doc_list) => {
            return res.status(200).send(full_doc_list);
          }).catch(err => console.log(err))
        }
      }) 
    } catch (error) {
      return res.status(401).send({error: 'Unauthorized'});
    }
  }
};

export default FilesController;