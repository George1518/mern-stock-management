function requireRole(role) {
  return (req, res, next) => {
    // check if user is logged in
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized – please login first"
      });
    }

    // check role
    if (req.session.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: "Forbidden – you don’t have permission"
      });
    }

    next();
  };
}

module.exports = { requireRole };
