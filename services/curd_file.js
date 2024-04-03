/*
 * @Author: kl
 * @email: qkeliang@163.com
 * @Date: 2024-03-26 09:14:48
 * @Description: 文件的增删改查
 * @LastEditors: kl
 */

const fs = require("fs-extra");
const path = require("path");

/**
 * 获取db文件夹下所有文件名称
 * /file/get_db_names GET
 * */
const getFileNames = async (ctx) => {
  const dbPath = path.resolve(__dirname, "../db");
  var dbNames = fs.readdirSync(dbPath);
  ctx.success({ db_names: dbNames });
};

/**
 * 根据名称创建文件
 * /file/create POST
 * name 文件名
 * */
const createFile = async (ctx) => {
  const { name } = ctx.request.body;

  const rules = {
    name: ctx.Joi.string().min(1).max(20).required(),
  };

  const { errors } = await ctx.validator(rules, ctx.request.body);
  if (errors?.length) return;

  const targetFilePath = path.join(__dirname, "..", "db", `${name}.json`);
  if (fs.existsSync(targetFilePath)) {
    ctx.resJson({
      code: 1,
      msg: "文件已存在",
    });
    return;
  } else {
    fs.writeJsonSync(targetFilePath, {});
    ctx.success({}, "文件创建成功");
  }
};

/**
 * 修改文件名称
 * /file/update POST
 * oldName 原文件名
 * newName 新文件名
 * */
const updateFileName = async (ctx) => {
  const { oldName, newName } = ctx.request.body;
  const rules = {
    oldName: ctx.Joi.string().min(1).max(20).required(),
    newName: ctx.Joi.string().min(1).max(20).required(),
  };

  const { errors } = await ctx.validator(rules, ctx.request.body);
  if (errors?.length) return;

  const oldFilePath = path.join(__dirname, "..", "db", `${oldName}.json`);
  const newFilePath = path.join(__dirname, "..", "db", `${newName}.json`);

  if (!ctx.fileExists(oldFilePath)) return;

  if (oldName === newName) {
    ctx.success({}, "文件名修改成功");
    return;
  }

  fs.renameSync(oldFilePath, newFilePath);
  ctx.success({}, "文件名修改成功");
};

/**
 * 删除文件
 * /file/delete/:name DELETE
 * name 要删除的文件名称
 *
 * */
const deleteFile = async (ctx) => {
  const { name } = ctx.request.params;

  const rules = {
    name: ctx.Joi.string().min(1).max(20).required(),
  };

  const { errors } = await ctx.validator(rules, ctx.request.params);
  if (errors?.length) return;

  const targetFilePath = path.join(__dirname, "..", "db", `${name}.json`);
  if (!ctx.fileExists(targetFilePath)) return;

  fs.removeSync(targetFilePath);
  ctx.success({}, "文件删除成功");
};

module.exports = {
  getFileNames,
  updateFileName,
  createFile,
  deleteFile,
};
