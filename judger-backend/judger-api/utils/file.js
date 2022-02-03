const cheerio = require('cheerio');
const { promises, existsSync } = require('fs');
const { sync } = require('mkdirp');
const multer = require('multer');
const { join, extname, basename } = require('path');
const { parse } = require('url');
const { v4 } = require('uuid');
const { ROOT_DIR, UPLOAD_DIR } = require('../env');
const { File } = require('../models/@main');
const { hasRole } = require('./permission');
const { difference } = require('./functions')
const {
  FORBIDDEN,
  LOGIN_REQUIRED
} = require('../errors');

const getBasename = url => basename(parse(url).pathname);

const createUpload = (uploadDir = UPLOAD_DIR) => {

  const dir = join(ROOT_DIR, uploadDir);
  if (!existsSync(dir)) sync(dir);

  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, dir);
    },
    filename(req, file, cb) {
      cb(null, `${v4()}${extname(file.originalname)}`);
    }
  });

  return multer({ storage });
};

const removeFileByUrl = async (user, url, baseDir = UPLOAD_DIR) => {
  if (!user) throw LOGIN_REQUIRED;
  if (!url) return;

  const file = await File.findOne({ url });

  if (!file) return;
  if (!hasRole(user) && String(user.info) !== String(file.uploader)) throw FORBIDDEN;

  const filePath = join(ROOT_DIR, '/', baseDir, '/', getBasename(url));

  await Promise.all([file.deleteOne(), promises.unlink(filePath)]);

  return filePath
};

const removeFileById = async (user, id, baseDir = UPLOAD_DIR) => {
  if (!user) throw LOGIN_REQUIRED;
  if (!id) return;
  const file = await File.findById(id);
  if (!file) return;
  if (!hasRole(user) && String(user.info) !== String(file.uploader)) throw FORBIDDEN;
  const filePath = join(ROOT_DIR, '/', baseDir, '/', getBasename(file.url));
  await Promise.all([file.deleteOne(), promises.unlink(filePath)]);
  return filePath
};

const removeFilesByUrls = async (req, urls, baseDir = UPLOAD_DIR) => await Promise.all(urls.map(url => removeFileByUrl(req, url, baseDir)));

const removeFilesByIds = async (req, ids, baseDir = UPLOAD_DIR) => await Promise.all(ids.map(id => removeFileById(req, id, baseDir)));

const updateFilesByUrls = async (user, ref, refModel, urls) => {
  const files = await File.find({ ref, refModel });

  if (!hasRole(user) && files.some(file => String(user.info) !== String(file.uploader)))
    throw FORBIDDEN;

  const inDB = files.map(file => file.url);
  const deletions = difference(inDB, urls);
  const additions = difference(urls, inDB);

  if (additions.length > 0) await File.updateMany({ url: { $in: additions } }, { $set: { ref, refModel } });
  // if (deletions.length > 0) await removeFilesByUrls(user, deletions);
};

const updateFilesByIds = async (user, ref, refModel, ids) => {
  const files = await File.find({ ref, refModel });

  if (!hasRole(user) && files.some(file => String(user.info) !== String(file.uploader)))
    throw FORBIDDEN;

  ids = ids.map(id => String(id));
  const inDB = files.map(file => String(file._id));
  const deletions = difference(inDB, ids);
  const additions = difference(ids, inDB);

  if (additions.length > 0) await File.updateMany({ _id: { $in: additions } }, { $set: { ref, refModel } });
  // if (deletions.length > 0) await removeFilesByIds(user, deletions);
};

const findImageUrlsFromHtml = html => {
  const $ = cheerio.load(html || '');
  const urls = [];

  $('img').each(function () {
    const url = $(this).attr('src');
    urls.push(url);
  });

  return urls;
};

exports.getBasename = getBasename;
exports.createUpload = createUpload;
exports.removeFileByUrl = removeFileByUrl;
exports.removeFileById = removeFileById;
exports.removeFilesByUrls = removeFilesByUrls;
exports.removeFilesByIds = removeFilesByIds;
exports.updateFilesByUrls = updateFilesByUrls;
exports.updateFilesByIds = updateFilesByIds;
exports.findImageUrlFromHtml = findImageUrlsFromHtml;
