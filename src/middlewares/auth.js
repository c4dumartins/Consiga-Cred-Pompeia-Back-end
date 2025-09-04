module.exports = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // Aqui você pode adicionar a lógica para verificar o token
  // Por exemplo, decodificar o token e verificar sua validade

  next();
};