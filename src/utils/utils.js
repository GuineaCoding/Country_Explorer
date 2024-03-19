export function isAdmin(req, res, next) {
  const isAdmin = req.auth.credentials && req.auth.credentials.role === "admin";
  res.locals.isAdmin = isAdmin; 
  next();
}