const express = require(express);
import AppController from "../controllers/AppController";
const index = express.Router();

index.get('status', (req, res) => {
  AppController.getStatus(req, res);
})

index.get('stats', (req, res) => {
  AppController.getStats(req, res)
})

export default index;