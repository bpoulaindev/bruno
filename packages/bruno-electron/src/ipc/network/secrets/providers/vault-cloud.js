// class vaultCLoud containing the following methods: getToken, getSecret, revokeToken
import { sendSimpleHttpRequest } from '@usebruno/app/src/utils/network';

const SecretsInstanceStore = require('../../../../store/secrets-instance');

const secretsInstanceStore = new SecretsInstanceStore();

class VaultCloud {
  constructor() {
    this.token = null;
  }
  async getToken(config, collectionPathname) {
    const url = 'https://auth.idp.hashicorp.com/oauth2/token';
    const credentials = secretsInstanceStore.getSecretsFromInstance(collectionPathname, config.name);
    if (!credentials.clientSecret || !credentials.clientID) {
      return Promise.reject(new Error('Client ID or Client Secret is missing'));
    }
    const body = {
      client_id: credentials.clientID,
      client_secret: credentials.clientSecret,
      grant_type: 'client_credentials',
      audience: 'https://api.hashicorp.cloud'
    };
    try {
      const result = await sendSimpleHttpRequest({
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
      });
      console.log('WE GOT A TOKEN', result?.access_token);
      this.token = result?.access_token;
      return result?.access_token;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  getSecret(secretPath) {
    return new Promise((resolve, reject) => {
      // Implementation details
    });
  }

  revokeToken() {
    return new Promise((resolve, reject) => {
      // Implementation details
    });
  }
}
