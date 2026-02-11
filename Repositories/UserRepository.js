import StorageService from "../Infrastructure/StorageService.js";

class UserRepository {
  constructor() {
    this.storageService = new StorageService();
  }
  findByEmail(email) {
    const users = this.storageService.getFromLocalStorage("users") || [];
    return users.find((user) => user.email === email);
  }
  findById(id) {
    const users = this.storageService.getFromLocalStorage("users") || [];
    return users.find((user) => user.id === id);
  }
  save(user) {
    const users = this.storageService.getFromLocalStorage("users") || [];
    users.push(user);
    this.storageService.saveToLocalStorage("users", users);
  }
  getAll() {
    return this.storageService.getFromLocalStorage("users") || [];
  }
  update(user) {
    const users = this.storageService.getFromLocalStorage("users") || [];
    const updatedUsers = users.map((u) => (u.id === user.id ? user : u));
    this.storageService.saveToLocalStorage("users", updatedUsers);
  }
  delete(user) {
    const users = this.storageService.getFromLocalStorage("users") || [];
    const updatedUsers = users.filter((u) => u.id !== user.id);
    this.storageService.saveToLocalStorage("users", updatedUsers);
  }
}

export default UserRepository;
