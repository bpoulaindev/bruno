// class vaultCLoud containing the following methods: getToken, getSecret, revokeToken
const { ipcMain } = require('electron');

const SecretsInstanceStore = require('../../../../store/secrets-instance');
const { makeAxiosInstance } = require('../../axios-instance');
const { simpleFetch } = require('./utils');
// const { simpleFetch } = require('./index');

const secretsInstanceStore = new SecretsInstanceStore();

class VaultCloud {
  constructor() {
    this.token = null;
  }
  async getToken(config, collectionPathname) {
    const url = 'https://auth.idp.hashicorp.com/oauth2/token';
    const credentials = await secretsInstanceStore.getSecretsFromInstance(collectionPathname, config.name);
    if (!credentials.clientSecret || !credentials.clientID) {
      throw new Error('Client ID or Client Secret is missing');
    }
    const body = {
      client_id: credentials.clientID,
      client_secret: credentials.clientSecret,
      grant_type: 'client_credentials',
      audience: 'https://api.hashicorp.cloud'
    };
    try {
      const result = await simpleFetch({
        url,
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });
      this.token = result?.access_token;
      return result?.access_token;
    } catch (error) {
      throw error;
    }
  }

  fetchDataWithAuth = async (url, token) => {
    return simpleFetch({
      url,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };

  // Function to handle token management and data retrieval
  async fetchSecretData(config, collectionPath, key, token) {
    const url = `https://api.cloud.hashicorp.com/secrets/2023-06-13/organizations/${config.orgID}/projects/${config.projectID}/apps/${config.appName}/open`;
    if (token) {
      const { data } = await this.fetchDataWithAuth(url, token);
      return data?.[key];
    }
    // If token is not provided, retrieve a new token and fetch data
    const newToken = await this.getToken(config, collectionPath);
    console.log('a new token has been collected', newToken);
    const data = await this.fetchDataWithAuth(url, newToken);
    const value = data?.secrets?.find((secret) => secret.name === key);
    if (!value) {
      throw new Error('Secret not found for following key : ' + key);
    }
    console.log('the value is', value?.version?.value);
    return value?.version?.value;
  }

  // Function to get secret with token management handled internally
  async getSecret(config, collectionPath, key) {
    // Check if a token is available
    console.log('the token is', this.token, !!this.token);
    if (!this.token) {
      // If no token available, fetch data with token management handled internally
      return this.fetchSecretData(config, collectionPath, key);
    } else {
      // If token available, fetch data directly with the existing token
      return this.fetchSecretData(config, collectionPath, key, this.token);
    }
  }

  revokeToken() {
    return new Promise((resolve, reject) => {
      // Implementation details
    });
  }
}

module.exports = {
  VaultCloud
};
