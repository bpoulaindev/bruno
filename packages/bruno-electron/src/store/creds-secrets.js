// create a safe store with electron-store and store client credentials in it
const Store = require('electron-store');

class CredsSecrets {
  constructor() {
    this.store = new Store({
      name: 'creds-secrets',
      clearInvalidConfig: true
    });
  }
  isValidValue(val) {
    return typeof val === 'string' && val.length >= 0;
  }
  // TODO : adapt to store client credentials in bruno.json
  /* storeCredsSecrets(collectionPathname, environment) {
    const envVars = [];
    _.each(environment.variables, (v) => {
      if (v.secret) {
        envVars.push({
          name: v.name,
          value: this.isValidValue(v.value) ? encryptString(v.value) : ''
        });
      }
    });
    const collections = this.store.get('collections') || [];
    const collection = _.find(collections, (c) => c.path === collectionPathname);
    if (!collection) {
      collections.push({
        path: collectionPathname,
        environments: [
          {
            name: environment.name,
            secrets: envVars
          }
        ]
      });
      this.store.set('collections', collections);
      return;
    }
    collection.environments = collection.environments || [];
    const env = _.find(collection.environments, (e) => e.name === environment.name);
    if (!env) {
      collection.environments.push({
        name: environment.name,
        secrets: envVars
      });
      this.store.set('collections', collections);
      return;
    }
    env.secrets = envVars;
    this.store.set('collections', collections);
  } */
}
