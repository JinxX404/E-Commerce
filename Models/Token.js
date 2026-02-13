class Token {
  constructor() {
    this.token = crypto.randomUUID();
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

  getToken() {
    return this.token;
  }

  isValid() {
    return this.expiresAt > new Date();
  }
}

export default Token;
