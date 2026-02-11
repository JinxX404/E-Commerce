class User {
  constructor(name, email, hashedPassword, createdAt = new Date()) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.email = email;
    this.hashedPassword = hashedPassword;
    this.createdAt = createdAt;
  }
}

export default User;
