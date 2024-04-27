export async function login(email: string, password: string) {
  if (email === "ryan@jk.com" && password === process.env.RYAN_PASSWORD) {
    // TODO: return user id, this is just a placeholder
    return 1;
  }

  return null;
}
