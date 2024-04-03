/*
 * @Author: kl
 * @email: qkeliang@163.com
 * @Date: 2024-03-26 10:23:00
 * @Description: 返回结构格式化
 * @LastEditors: kl
 */

module.exports = async (ctx, next) => {
  ctx.resJson = (ctxBody) => {
    ctx.type = "application/json";
    ctx.body = ctxBody;
  };

  ctx.success = function (data, msg) {
    ctx.type = "application/json";
    ctx.body = {
      code: 0,
      msg: msg || "success",
      data,
    };
  };

  ctx.fail = function (msg, code) {
    ctx.type = "application/json";
    ctx.body = {
      code: code || -1,
      msg: msg || "fail",
    };
  };

  await next();
};
