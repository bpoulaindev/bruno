const { VaultCloud } = require('./vault-cloud');
const { VaultServer } = require('./vault-server');
const { makeAxiosInstance } = require('../../axios-instance');

const vaultCloud = new VaultCloud();
// TODO: Implement the VaultServer class
// const vaultServer = new VaultServer();

const secretsProvider = (config) => {
  let provider;
  switch (config.provider) {
    case 'vault-cloud':
      provider = vaultCloud;
      break;
    case 'vault-server':
      provider = vaultCloud;
      // provider = vaultServer;
      break;
    default:
      provider = vaultCloud;
      break;
  }
  return provider;
};

module.exports = {
  secretsProvider
};
