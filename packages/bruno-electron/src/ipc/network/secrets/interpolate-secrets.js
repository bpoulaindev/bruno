const extractSecrets = (match, secretsConfig, collectionPath) => {
  // split match into array, 0 index is $secret, 1 index is the instance name, 2 index is the secret key
  const splitMatch = match.split(':');
  if (splitMatch.length !== 3) {
    return undefined;
  }
  const secretProvider = secretsConfig.find((secret) => secret.provider === splitMatch[1]);
  console.log('the secret provider is', secretProvider);
};

const interpolateSecrets = (match, secretsConfig = [], collectionPath) => {
  // const secret = secretsConfig.find((secret) => secret.key === match);
  console.log('a secret provider has been called', match);
  // match is a string, check if it contains $secret

  if (match.includes('$secret')) {
    return extractSecrets(match, secretsConfig, collectionPath);
  }
  return undefined;
};

module.exports = {
  interpolateSecrets
};
