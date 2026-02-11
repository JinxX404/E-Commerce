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

  // getAllUsersFromLocalStorage() {
  //   const users = this.storage.getItem("users");
  //   return JSON.parse(users) || [];
  // }
  // getUserByIdFromLocalStorage(id) {
  //   const users = this.storage.getItem("users");
  //   return JSON.parse(users).find((user) => user.id === id) || null;
  // }
  // getUserByEmailFromLocalStorage(email) {
  //   const users = this.storage.getItem("users");
  //   return JSON.parse(users).find((user) => user.email === email) || null;
  // }

  // saveUserToLocalStorage(user) {
  //   const users = this.getAllUsersFromLocalStorage() || [];
  //   const userExists = this.getUserByEmailFromLocalStorage(user.email);
  //   if (userExists) {
  //     throw new Error("User already exists");
  //   }
  //   users.push(user);
  //   this.saveToLocalStorage("users", users);
  // }

  // getAllFromLocalStorage() {
  //   const users = this.storage.getItem("users");
  //   return JSON.parse(users) || [];
  // }

  // getAllKeysFromLocalStorage() {
  //   const users = this.storage.getItem("users");
  //   return JSON.parse(users) || [];
  // }

  // getAllValuesFromLocalStorage() {
  //   const users = this.storage.getItem("users");
  //   return JSON.parse(users) || [];
  // }

  // getAllItemsFromLocalStorage() {
  //   const users = this.storage.getItem("users");
  //   return JSON.parse(users) || [];
  // }
}

export default StorageService;
