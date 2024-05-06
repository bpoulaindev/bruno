const { secretsProvider } = require('./providers');

const extractSecrets = async (match, secretsConfig, collectionPath) => {
  // split match into array, 0 index is $secret, 1 index is the instance name, 2 index is the secret key
  const splitMatch = match.split(':');
  if (splitMatch.length !== 3) {
    return undefined;
  }
  // find the secret provider : vault-cloud or vault-server
  const provider = secretsConfig.find((instance) => instance.name === splitMatch[1]);
  console.log('the secret provider is', provider);
  if (!provider) {
    return undefined;
  }
  // initialize an instance
  const instance = secretsProvider(provider);
  // retrieve the token, splitMatch[2] is returned with }} at the end, so we need to remove it
  const result = await instance.getSecret(provider, collectionPath, splitMatch[2].replace(/}}/g, ''));
  console.log('result in extractSecrets', result);
  return result;
};

const interpolateSecrets = async (match, secretsConfig = [], collectionPath) => {
  // const secret = secretsConfig.find((secret) => secret.key === match);
  console.log('a secret provider has been called', match);
  // match is a string, check if it contains $secret

  if (match.includes('$secret')) {
    const result = await extractSecrets(match, secretsConfig, collectionPath);
    console.log('result in interpolateSecrets', result);
    return result;
  }
  return undefined;
};

module.exports = {
  interpolateSecrets
};
