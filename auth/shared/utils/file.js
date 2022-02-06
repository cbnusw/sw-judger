const multer = require('multer');
const { join, extname, basename } = require('path');
const cheerio = require('cheerio');
const { promises, existsSync } = require('fs');
const { parse } = require('url');
const { v4 } = require('uuid');
const { sync } = require('mkdirp');
const { ROOT_DIR, UPLOAD_DIR } = require('../env');
const { File } = require('../models/@main');
const { hasRoles } = require('../utils/permission');
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

const findImageUrlsFromHtml = html => {
  const $ = cheerio.load(html || '');
  const urls = [];

  $('img').each(function () {
    const url = $(this).attr('src');
    urls.push(url);
  });

  return urls;
};

const removeFileByUrl = async (req, url, baseDir = UPLOAD_DIR) => {
  const { user } = req;
  if (!user) throw LOGIN_REQUIRED;
  if (!url) return;
  const file = await File.findOne({ url });
  if (!file) return;
  if (!hasRoles(user) && String(user.info) !== String(file.uploader)) throw FORBIDDEN;
  const filePath = join(ROOT_DIR, baseDir, getBasename(url));
  await Promise.all([file.deleteOne(), promises.unlink(filePath)]);
};

const removeFileById = async (req, id, baseDir = UPLOAD_DIR) => {
  const { user } = req;
  if (!user) throw LOGIN_REQUIRED;
  if (!id) return;
  const file = await File.findById(id);
  if (!file) return;
  if (!hasRoles(user) && String(user.info) !== String(file.uploader)) throw FORBIDDEN;
  const filePath = join(ROOT_DIR, baseDir, getBasename(file.url));
  await Promise.all([file.deleteOne(), promises.unlink(filePath)]);
};

const removeFilesByUrls = async (req, urls, baseDir = UPLOAD_DIR) => await Promise.all(urls.map(url => removeFileByUrl(req, url, baseDir)));

const removeFilesByIds = async (req, ids, baseDir = UPLOAD_DIR) => await Promise.all(ids.map(id => removeFileById(req, id, baseDir)));

const updateFiles = async (req, ref, refModel, urls = []) => {
  const { user } = req;
  const files = await File.find({ ref, refModel });
  urls = urls.filter(url => !!url);

  if (!hasRoles(user) && files.some(file => String(user.info) !== String(file.uploader)))
    throw FORBIDDEN;

  const inDB = files.map(file => file.url);
  const deletions = difference(inDB, urls);
  const additions = difference(urls, inDB);

  if (additions.length > 0) await File.updateMany({ url: { $in: additions } }, { $set: { ref, refModel } });
  if (deletions.length > 0) await removeFilesByUrls(req, deletions);
};

exports.getBasename = getBasename;
exports.createUpload = createUpload;
exports.findImageUrlsFromHtml = findImageUrlsFromHtml;
exports.removeFileByUrl = removeFileByUrl;
exports.removeFileById = removeFileById;
exports.removeFilesByUrls = removeFilesByUrls;
exports.removeFilesByIds = removeFilesByIds;
exports.updateFiles = updateFiles;
