export function getJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret) {
    throw new Error('JWT_SECRET nao foi definido no ambiente.');
  }

  if (process.env.NODE_ENV === 'production' && secret.length < 32) {
    throw new Error('JWT_SECRET deve ter pelo menos 32 caracteres em producao.');
  }

  return secret;
}
