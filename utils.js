function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashedPassword = await crypto.subtle.digest("SHA-256", data);
  const hex = Array.from(new Uint8Array(hashedPassword))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hex;
}

async function verifyPassword(inputPassword, hashedPassword) {
  const hashedInputPassword = await hashPassword(inputPassword);
  return hashedInputPassword === hashedPassword;
}

function generateToken() {
  return crypto.randomUUID();
}

export {
  validateEmail,
  validatePassword,
  hashPassword,
  verifyPassword,
  generateToken,
};
