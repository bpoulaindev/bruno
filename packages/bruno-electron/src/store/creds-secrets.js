// create a safe store with electron-store and store client credentials in it
const Store = require('electron-store');
const { encryptString } = require('../utils/encryption');
const _ = require('lodash');

class CredsSecretsStore {
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
  /* credentials type :
    {
      "name": "service1",
      "clientID": 'clientID',
      "clientSecret": 'clientSecret'
    }[]
  */
  storeCredsSecrets(collectionPathname, credentials) {
    const creds = [];
    _.each(credentials, (v) => {
      creds.push({
        name: v.name,
        clientID: this.isValidValue(v.clientID) ? encryptString(v.clientID) : '',
        clientSecret: this.isValidValue(v.clientSecret) ? encryptString(v.clientSecret) : ''
      });
    });
    const collections = this.store.get('collections') || [];
    const collection = _.find(collections, (c) => c.path === collectionPathname);

    // if collection doesn't exist, create it, add the environment and save
    if (!collection) {
      collections.push({
        path: collectionPathname,
        credentials: creds
      });
      this.store.set('collections', collections);
      return;
    }

    // if collection exists, check if credentials exists
    // if credentials don't exist, add the creds and save
    const cred = _.find(collection.credentials || [], (e) => e.name === credentials.name);
    if (!cred) {
      collection.credentials.push({
        name: credentials.name,
        clientID: this.isValidValue(credentials.clientID) ? encryptString(credentials.clientID) : '',
        clientSecret: this.isValidValue(credentials.clientSecret) ? encryptString(credentials.clientSecret) : ''
      });

      this.store.set('collections', collections);
      return;
    }

    // if credentials exists, update the secrets and save
    const clonedCollection = {
      ...collection,
      credentials: collection.credentials.map((c) => {
        if (c.name === credentials.name) {
          return {
            ...c,
            clientID: this.isValidValue(credentials.clientID) ? encryptString(credentials.clientID) : '',
            clientSecret: this.isValidValue(credentials.clientSecret) ? encryptString(credentials.clientSecret) : ''
          };
        }
        return c;
      })
    };
    this.store.set('collections', {
      ...collections,
      clonedCollection
    });
  }

  getCredsSecrets(collectionPathname, name) {
    const collections = this.store.get('collections') || [];
    const collection = _.find(collections, (c) => c.path === collectionPathname);
    if (!collection) {
      return [];
    }

    const cred = _.find(collection.credentials || [], (e) => e.name === name);
    if (!cred) {
      return [];
    }
    return cred;
  }

  renameCredsSecrets(collectionPathname, oldName, newName) {
    const collections = this.store.get('collections') || [];
    const collection = _.find(collections, (c) => c.path === collectionPathname);
    if (!collection) {
      return;
    }

    const cred = _.find(collection.credentials, (e) => e.name === oldName);
    if (!cred) {
      return;
    }

    cred.name = newName;
    this.store.set('collections', collections);
  }

  /* adapt the following function to match with credentials instead of environments
deleteEnvironment(collectionPathname, environmentName) {
    const collections = this.store.get('collections') || [];
    const collection = _.find(collections, (c) => c.path === collectionPathname);
    if (!collection) {
      return;
    }

    _.remove(collection.environments, (e) => e.name === environmentName);
    this.store.set('collections', collections);
  }
 */
  deleteCredsSecrets(collectionPathname, name) {
    const collections = this.store.get('collections') || [];
    const collection = _.find(collections, (c) => c.path === collectionPathname);
    if (!collection) {
      return;
    }

    _.remove(collection.credentials, (e) => e.name === name);
    this.store.set('collections', collections);
  }
}

module.exports = CredsSecretsStore;
