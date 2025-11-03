module.exports = (allowedRoles) => {
  return (req, res, next) => {
    try {
      console.log("Role middleware running...");
      console.log("Allowed Roles:", allowedRoles);
      console.log("User Role:", req.user?.role);

      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied. You are not authorized for this action.",
        });
      }
      next();
    } catch (error) {
      console.error("Error in role middleware:", error);
      return res.status(500).json({ message: "Server error in role middleware" });
        }
    };
};