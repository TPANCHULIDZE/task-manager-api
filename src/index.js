const express = require("express");
require("./db/mongoose");
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const app = express();
const auth = require('./middleware/auth');
const multer = require('multer');

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("start server port = " + port);
});



