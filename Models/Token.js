class Token {
  constructor() {
    this.token = this.generateToken();
    this.issuedAt = new Date();
    this.expiresAt = new Date(this.issuedAt.getTime() + 60 * 60 * 1000);
    this.userId = null;
  }

  getUserId() {
    return this.userId;
  }

  setUserId(userId) {
    this.userId = userId;
  }
}
