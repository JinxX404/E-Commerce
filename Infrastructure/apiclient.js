class ApiClient {
  async get(url) {
    return await fetch(url)
      .then((response) => response.json())
      .catch((error) => {
        console.log(error);
      });
  }
}

export default ApiClient;
