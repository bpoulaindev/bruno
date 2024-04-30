const interpolateSecrets = (match, secretsConfig = [], collectionPath) => {
  // const secret = secretsConfig.find((secret) => secret.key === match);
  console.log('a secret provider has been called', match);
  return 'another random string';
};

module.exports = {
  interpolateSecrets
};
