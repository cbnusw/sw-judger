const axios = require('axios');
const asyncHandler = require('express-async-handler');
const { AUTH_APP_HOST } = require('../env');
const { FORBIDDEN } = require('../errors');
const {
  hasRole: _hasRole,
  hasRoles: _hasRoles,
  hasPermission: _hasPermission,
  hasEveryPermissions: _hasEveryPermissions,
  hasSomePermissions: _hasSomePermissions,
} = require('../utils/permission');

const authenticate = asyncHandler(async (req, res, next) => {
  const accessToken = req.headers['x-access-token'] || req.query['access_token'];
  if (!accessToken) {
    delete req.user;
    return next();
  }

  try {
    const headers = { 'x-access-token': accessToken };
    const response = await axios.get(`${AUTH_APP_HOST}/token/validate`, { headers });
    const { data } = response.data;

    req.user = data;
    next();
  } catch (e) {
    next();
  }
});

const isAuthenticated = asyncHandler(async (req, res, next) => {
  const headers = {};
  const accessToken = req.headers['x-access-token'] || req.query['access_token'];
  if (accessToken) headers['x-access-token'] = accessToken;

  try {
    const response = await axios.get(`${AUTH_APP_HOST}/token/validate`, { headers });
    const { data } = response.data;
    req.user = data;
    next();
  } catch (e) {
    next(e.response && e.response.data || e);
  }
});

const hasRole = role => [
  isAuthenticated,
  (req, res, next) => _hasRole(req.user, role) ? next() : next(FORBIDDEN)
];

const hasRoles = (...roles) => [
  isAuthenticated,
  (req, res, next) => _hasRoles(req.user, ...roles) ? next() : next(FORBIDDEN)
];


const hasProblemPermission = [
  isAuthenticated,
  (req, res, next) => _hasPermission(req.user, req.parentType ? req.parentType : 'Problem') ? next() : next(FORBIDDEN)
];
const hasPermission = permission => [
  isAuthenticated,
  (req, res, next) => _hasPermission(req.user, permission) ? next() : next(FORBIDDEN)
];




const attended = permission => [
  isAuthenticated,
  (req, res, next) => _hasPermission(req.user, permission) ? next() : next(FORBIDDEN)
];

const hasSomePermissions = (...permissions) => [
  isAuthenticated,
  (req, res, next) => _hasSomePermissions(req.user, ...permissions) ? next() : next(FORBIDDEN)
];

const hasEveryPermissions = (...permissions) => [
  isAuthenticated,
  (req, res, next) => _hasEveryPermissions(req.user, ...permissions) ? next() : next(FORBIDDEN)
];

const isAttended = asyncHandler(async (req, res, next) => {
  next();
  // const { query } = req;
  // const finded = Problem.find()
  //   .where('_id').equal(query.problem)
  //   .select('contest')
  // const finded2 = Problm.find()
  //   .where('_id').equal(finded)
  //   .select('contestants')
  // if (finded2.includes(query.user)) next()
  // else next(FORBIDDEN)
});

exports.authenticate = authenticate;
exports.isAuthenticated = isAuthenticated;
exports.isOperator = hasRoles();
exports.isStaff = hasRole('staff');
exports.isStudent = hasRole('student');
exports.isAttended = isAttended
exports.hasRole = hasRole;
exports.hasRoles = hasRoles;
exports.hasPermission = hasPermission;
exports.hasProblemPermission = hasProblemPermission;
exports.hasSomePermissions = hasSomePermissions;
exports.hasEveryPermissions = hasEveryPermissions;
