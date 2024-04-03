/*
 * @Author: kl
 * @email: qkeliang@163.com
 * @Date: 2024-03-25 18:16:06
 * @Description: 入口
 * @LastEditors: kl
 */

const Koa = require("koa");
const Router = require("@koa/router");
const compose = require("koa-compose");
const bodyParser = require("koa-bodyparser");
const errorHandler = require("./middleware/error_handler");
const responseFormat = require("./middleware/response_format");
const tools = require("./middleware/tools");
const curdByDB = require("./services/curd_db");
const curdByFile = require("./services/curd_file");

const app = new Koa();
const router = new Router();
const PORT = 9527;

app.use(compose([errorHandler, responseFormat, bodyParser(), tools]));

router
  .get("/", curdByDB.hello)
  .get("/file/get_db_names", curdByFile.getFileNames)
  .post("/file/create", curdByFile.createFile)
  .post("/file/update", curdByFile.updateFileName)
  .del("/file/delete/:name", curdByFile.deleteFile)
  .get("/db/get_detail", curdByDB.getDetail)
  .post("/db/update", curdByDB.update)
  .del("/db/delete/:name", curdByDB.deleteByKey);

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`app running at:  http://localhost:${PORT}/`);
});
