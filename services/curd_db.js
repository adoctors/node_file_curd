/*
 * @Author: kl
 * @email: qkeliang@163.com
 * @Date: 2024-03-25 18:18:23
 * @Description:
 * @LastEditors: kl
 */
const fs = require("fs-extra");
const path = require("path");

const hello = async (ctx) => {
  ctx.response.body = "Hello World";
};

/**
 * 根据文件名称获取文件所有内容或指定key的value
 * /db/get_detail?name=user&key=email GET
 * name 对应的db文件
 * key? 对应文件的中的key
 *
 * */
const getDetail = async (ctx) => {
  const { name, key } = ctx.request.query;
  const rules = {
    name: ctx.Joi.string().min(1).max(20).required(),
    key: ctx.Joi.string().min(1).max(20).allow(""),
  };

  const { errors } = await ctx.validator(rules, ctx.request.query);
  if (errors?.length) return;

  const targetFilePath = path.join(__dirname, "..", "db", `${name}.json`);
  if (!ctx.fileExists(targetFilePath)) return;

  let result = fs.readJsonSync(targetFilePath);

  if (key) {
    result = {
      [key]: result?.[key] || null,
    };
  }
  ctx.success(result);
};

/**
 * 在json中插值，如果有key则覆盖
 * /db/update POST
 * name 对应的db文件
 * data 创建或修改的值
 * key? 存在时修改对应的值，覆盖性的
 *
 * */
const update = async (ctx) => {
  const { name, data, key } = ctx.request.body;
  const rules = {
    name: ctx.Joi.string().min(1).max(20).required(),
    data: ctx.Joi.object()
      .pattern(ctx.Joi.string(), ctx.Joi.any())
      .min(1)
      .required(),
    key: ctx.Joi.string().min(1).max(20).allow(""),
  };

  const { errors } = await ctx.validator(rules, ctx.request.body);
  if (errors?.length) return;

  const targetFilePath = path.join(__dirname, "..", "db", `${name}.json`);
  if (!ctx.fileExists(targetFilePath)) return;

  let result = fs.readJsonSync(targetFilePath);

  if (key) {
    result[key] = data;
  } else {
    result = { ...result, ...data };
  }

  fs.writeJsonSync(targetFilePath, result);
  ctx.success();
};

/**
 * 根据key删除对应的值
 * /db/delete/:name DELETE
 * name
 * key
 * */
const deleteByKey = async (ctx) => {
  const { key } = ctx.request.query;
  const { name } = ctx.request.params;
  const rules = {
    name: ctx.Joi.string().min(1).max(20).required(),
    key: ctx.Joi.string().min(1).max(20).required(),
  };

  const { errors } = await ctx.validator(rules, {
    key,
    name,
  });
  if (errors?.length) return;

  const targetFilePath = path.join(__dirname, "..", "db", `${name}.json`);
  if (!ctx.fileExists(targetFilePath)) return;

  let result = fs.readJsonSync(targetFilePath);

  if (result[key]) {
    delete result[key];
    fs.writeJsonSync(targetFilePath, result);
  }
  ctx.success();
};

module.exports = {
  hello,
  getDetail,
  update,
  deleteByKey,
};
