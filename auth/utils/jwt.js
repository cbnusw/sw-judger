const jwt = require('jsonwebtoken');
const { readFileSync } = require('fs');
const { join } = require('path');
const { RefreshToken } = require('../shared/models/@auth');
const {
  ROOT_DIR,
  JWT_ACCESS_TOKEN_PRIVATE_KEY_FILE,
  JWT_ACCESS_TOKEN_PUBLIC_KEY_FILE,
  JWT_REFRESH_TOKEN_PRIVATE_KEY_FILE,
  JWT_REFRESH_TOKEN_PUBLIC_KEY_FILE,
  JWT_ACCESS_TOKEN_EXPIRES_IN,
  JWT_REFRESH_TOKEN_EXPIRES_IN,
  JWT_ISSUER: issuer,
  JWT_SUBJECT: subject,
  JWT_AUDIENCE: audience
} = require('../shared/env');
const {
  ACCESS_TOKEN_EXPIRED,
  INVALID_ACCESS_TOKEN,
  INVALID_REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRED,
} = require('../shared/errors');

const ACCESS_TOKEN_PRIVET_KEY = readFileSync(join(ROOT_DIR, JWT_ACCESS_TOKEN_PRIVATE_KEY_FILE));
const ACCESS_TOKEN_PUBLIC_KEY = readFileSync(join(ROOT_DIR, JWT_ACCESS_TOKEN_PUBLIC_KEY_FILE));
const REFRESH_TOKEN_PRIVATE_KEY = readFileSync(join(ROOT_DIR, JWT_REFRESH_TOKEN_PRIVATE_KEY_FILE));
const REFRESH_TOKEN_PUBLIC_KEY = readFileSync(join(ROOT_DIR, JWT_REFRESH_TOKEN_PUBLIC_KEY_FILE));

const options = {
  issuer,
  subject,
  audience,
  algorithm: 'RS256'
};

const signAccessToken = payload =>
  new Promise((resolve, reject) => jwt.sign(
    payload,
    ACCESS_TOKEN_PRIVET_KEY,
    {
      ...options,
      expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN
    }, (err, encoded) => err ? reject(err) : resolve(encoded))
  );

const signRefreshToken = _id =>
  new Promise((resolve, reject) => jwt.sign(
    { _id },
    REFRESH_TOKEN_PRIVATE_KEY,
    {
      ...options,
      expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN
    }, (err, encoded) => err ? reject(err) : resolve(encoded))
  );

const verifyAccessToken = token =>
  new Promise((resolve, reject) => jwt.verify(
    token,
    ACCESS_TOKEN_PUBLIC_KEY,
    options,
    (err, decoded) =>
      err ? reject(err.name === 'TokenExpiredError' ? ACCESS_TOKEN_EXPIRED : INVALID_ACCESS_TOKEN) : resolve(decoded)
  ));

const verifyRefreshToken = token =>
  new Promise((resolve, reject) => jwt.verify(
    token,
    REFRESH_TOKEN_PUBLIC_KEY,
    options,
    (err, decoded) => {
      if (err) {
        reject(err.name === 'TokenExpiredError' ? REFRESH_TOKEN_EXPIRED : INVALID_REFRESH_TOKEN);
      } else {
        const user = decoded._id;
        RefreshToken.findOne({ user, value: token }, (err, doc) => {
          if (err || !doc) reject(INVALID_REFRESH_TOKEN);
          else resolve(user);
        });
      }
    }
  ));

exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
