/**
 * Authorize access to specific roles
 * @param {...string} roles - List of allowed roles (e.g. 'admin', 'user')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized, no user context found'));
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      return next(
        new Error(`User role '${req.user.role}' is not authorized to access this resource`)
      );
    }

    next();
  };
};

module.exports = { authorizeRoles };
