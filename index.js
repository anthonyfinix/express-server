const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const db = require("./db.js");
const api = require("./routes/api");
const logIncomingReq = require("./utils/logIncomingRequest");
const notFound = require("./utils/notfound");
const errorHandle = require("./utils/errorHandle");
const cors = require("cors");
const handleToken = require('./routes/user/util/handleToken');

const port = 5000;
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(logIncomingReq);
app.use(handleToken)
app.use(express.static("public"));
db.init().then(() => {
  
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
  app.use("/api", api);
  app.use('/test',(req,res)=>{
    let response = {}
    if(req.user) response.user = req.user;
    if(req.cookies) response.cookies = req.cookies;
    res.json(response)
  })
  app.use(notFound);
  app.use(errorHandle);

  app.listen(process.env.PORT || port, () => {
    console.log(`Express Listening at port ${port}`);
  });
});
