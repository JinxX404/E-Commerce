class StorageService {
  constructor() {
    this.storage = localStorage;
  }

  saveToLocalStorage(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  getFromLocalStorage(key) {
    return JSON.parse(this.storage.getItem(key));
  }

  removeFromLocalStorage(key) {
    this.storage.removeItem(key);
  }

  clearLocalStorage() {
    this.storage.clear();
  }

  updateLocalStorage(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  getAllUsersFromLocalStorage() {
    return this.storage.getItem("users") || [];
  }
  getUserByIdFromLocalStorage(id) {
    return this.storage.getItem("users").find((user) => user.id === id) || null;
  }
  getUserByEmailFromLocalStorage(email) {
    return (
      this.storage.getItem("users").find((user) => user.email === email) || null
    );
  }

  saveUserToLocalStorage(user) {
    const users = this.getAllUsersFromLocalStorage() || [];
    users.push(user);
    this.saveToLocalStorage("users", users);
  }

  getAllFromLocalStorage() {
    return this.storage;
  }

  getAllKeysFromLocalStorage() {
    return Object.keys(this.storage);
  }

  getAllValuesFromLocalStorage() {
    return Object.values(this.storage);
  }

  getAllItemsFromLocalStorage() {
    return Object.entries(this.storage);
  }
}

export default StorageService;
