const express = require('express');
const port = process.env.PORT || 5000;

const app = express();

var index = require("./routes/index.js");

app.use(express.json())
app.use("/", index)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
