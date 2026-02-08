class User {
  constructor(name, email, hashedPassword, createdAt = new Date()) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.email = email;
    this.hashedPassword = hashedPassword;
    this.createdAt = createdAt;
  }

  //   login() {
  //     console.log("User logged in");
  //   }

  //   logout() {
  //     console.log("User logged out");
  //   }
}

export default User;
