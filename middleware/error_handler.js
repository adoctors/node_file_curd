/*
 * @Author: kl
 * @email: qkeliang@163.com
 * @Date: 2024-03-26 09:51:43
 * @Description: 错误处理
 * @LastEditors: kl
 */

module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const status = err.statusCode || err.status || 500;
    ctx.response.status = status;
    ctx.response.body = {
      code: status,
      msg: err.message,
    };
  }
};
