/*
 * @Author: kl
 * @email: qkeliang@163.com
 * @Date: 2024-03-29 21:47:16
 * @Description: 一些工具
 * @LastEditors: kl
 */
const fs = require("fs-extra");
const Joi = require("joi");

module.exports = async (ctx, next) => {
  /**
   * 验证文件路径是否存在，并返回boolean, 不存在同时会返回给用户端
   * filePath 文件路径
   * */
  ctx.fileExists = (filePath) => {
    let isExists = true;
    if (!fs.existsSync(filePath)) {
      isExists = false;
      ctx.resJson({
        code: 1,
        msg: "文件不存在",
      });
    }
    return isExists;
  };

  ctx.Joi = Joi;

  /**
   * 参数验证
   * schema     校验的规则
   * values     待校验的值
   * errorMsg?  自定义错误信息
   */
  ctx.validator = async (schema, values, errorMsg) => {
    const Schema = Joi.object(schema);
    let errors;
    try {
      await Schema.validateAsync(values);
    } catch (error) {
      errors = error?.details;
      ctx.resJson({
        code: 1,
        msg: errorMsg || errors?.[0]?.message || "参数有误",
      });
    }
    return {
      values,
      errors,
    };
  };

  next();
};
