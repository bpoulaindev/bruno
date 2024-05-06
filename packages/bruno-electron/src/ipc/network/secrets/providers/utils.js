const { makeAxiosInstance } = require('../../axios-instance');
const simpleFetch = async ({ url, method, headers, body }) => {
  return new Promise((resolve, reject) => {
    const axiosInstance = makeAxiosInstance();
    axiosInstance({
      url,
      method: method || 'GET',
      headers,
      data: body
    })
      .then((response) => {
        resolve(response?.data || response);
      })
      .catch((err) => {
        if (err.response) {
          resolve({
            code: err.code,
            status: err.response.status,
            statusText: err.response.statusText,
            data: err.response.data
          });
        }
        reject(err);
      });
  });
};

module.exports = {
  simpleFetch
};
