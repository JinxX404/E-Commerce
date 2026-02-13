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
}

export default StorageService;
