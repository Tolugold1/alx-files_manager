const express = require('express');
const bodyParser = require('body-parser');
import AppController from "../controllers/AppController";
import UsersController from "../controllers/UsersController";
import AuthController from "../controllers/AuthController";
import FilesController from "../controllers/FilesController"
const index = express.Router();
index.use(bodyParser.json())

index.get('status', (req, res) => {
  AppController.getStatus(req, res);
});

index.get('stats', (req, res) => {
  AppController.getStats(req, res)
});

index.get('users' , (req, res) => {
  UsersController.postNew(req, res);
});

index.get('connect', (req, res) => {
  AuthController.getConnect(req, res);
});

index.get('disconnect', (req, res) => {
  AuthController.getDisconnect(req, res);
});

index.get('users/me', (req, res) => {
  UsersController.getMe(req, res);
});

index.post('files', (req, res) => {
  FilesController.postUpload(req, res);
});

index.get('files/:id', (req, res) => {
  FilesController.getShow(req, res);
});

index.get('files', (req, res) => {
  FilesController.getIndex(req, res);
});

export default index;
