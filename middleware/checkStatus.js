exports.checkStatus = (req, res, next) => {
  if (req.user.status === 'banned') {
    return res.status(403).json({ message: 'Your account is banned.' });
  }
  next();
};
