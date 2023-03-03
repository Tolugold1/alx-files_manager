const express = require(express);
import AppController from "../controllers/AppController";
import UsersController from "../controllers/UsersController";
import AuthController from "../controllers/AuthController";
import FilesController from "../controllers/FilesController"
const index = express.Router();

index.get('status', (req, res) => {
  AppController.getStatus(req, res);
});

index.get('stats', (req, res) => {
  AppController.getStats(req, res)
});

index.get('users' , (req, res) => {
  UsersController.postNew;
});

index.get('connect', (req, res) => {
  AuthController.getConnect;
});

index.get('disconnect', (req, res) => {
  AuthController.getDisconnect;
});

index.get('users/me', (req, res) => {
  UsersController.getMe;
});

index.post('files', (req, res) => {
  FilesController.postUpload;
});

export default index;
