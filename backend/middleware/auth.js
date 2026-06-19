import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token tapılmadı' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token etibarsızdır' });
  }
};
