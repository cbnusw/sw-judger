const hasRole = (user, role) => user && (role ? ['admin', 'operator', role] : ['admin', 'operator']).some(r => r === user.role);

const hasRoles = (user, ...roles) => user && ['admin', 'operator', ...roles].some(role => role === user.role);

const hasPermission = (user, permission) => {
  if (!user) return false;
  if (hasRoles(user)) return true;
  if (user.permissions.includes('all')) return true;
  return user.permissions.includes(permission);
};

const hasSomePermissions = (user, ...permissions) =>
  !user ? false : permissions.some(permission => hasPermission(user, permission));

const hasEveryPermissions = (user, ...permissions) =>
  !user ? false : permissions.every(permission => hasPermission(user, permission));

exports.hasRole = hasRole;
exports.hasRoles = hasRoles;
exports.hasPermission = hasPermission;
exports.hasSomePermissions = hasSomePermissions;
exports.hasEveryPermissions = hasEveryPermissions;
