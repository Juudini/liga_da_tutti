export function authorize(...allowedRoles) {
  return function authorizeMiddleware(req, res, next) {
    const role = req.user?.role;

    if (!role || !allowedRoles.includes(role)) {
      return res
        .status(403)
        .json({ message: "No tenés permiso para esta acción" });
    }

    return next();
  };
}
