const asyncHandler = require('express-async-handler');
const { verifyAccessToken } = require('../utils/jwt');
const {
  hasRole: _hasRole,
  hasRoles: _hasRoles,
  hasPermission: _hasPermission,
  hasEveryPermissions: _hasEveryPermissions,
  hasSomePermissions: _hasSomePermissions
} = require('../shared/utils/permission');
const {
  FORBIDDEN,
  TOKEN_REQUIRED
} = require('../shared/errors');

const isAuthenticated = asyncHandler(async (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (token) {
    try {
      req.user = await verifyAccessToken(token);
      return next();
    } catch (e) {
      return next(e);
    }
  }
  return next(TOKEN_REQUIRED);
});

const hasRole = role => [
  isAuthenticated,
  (req, res, next) => _hasRole(req.user, role) ? next() : next(FORBIDDEN)
];

const hasRoles = (...roles) => [
  isAuthenticated,
  (req, res, next) => _hasRoles(req.user, ...roles) ? next() : next(FORBIDDEN)
];

const hasPermission = permission => [
  isAuthenticated,
  (req, res, next) => _hasPermission(req.user, permission) ? next() : next(FORBIDDEN)
];

const hasEveryPermissions = (...permissions) => [
  isAuthenticated,
  (req, res, next) => _hasEveryPermissions(req.user, ...permissions) ? next() : next(FORBIDDEN)
];

const hasSomePermissions = (...permissions) => [
  isAuthenticated,
  (req, res, next) => _hasSomePermissions(req.user, ...permissions) ? next() : next(FORBIDDEN)
];

exports.isAuthenticated = isAuthenticated;
exports.isOperator = hasRoles();
exports.isStaff = hasRole('staff');
exports.isStudent = hasRole('student');
exports.isMember = hasRole('member');
exports.hasRole = hasRole;
exports.hasRoles = hasRoles;
// exports.hasEveryRoles = hasEveryRoles;
// exports.hasSomeRoles = hasSomeRoles;
exports.hasPermission = hasPermission;
exports.hasEveryPermissions = hasEveryPermissions;
exports.hasSomePermissions = hasSomePermissions;
