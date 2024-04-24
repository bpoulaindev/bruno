// create a safe store with electron-store and store client credentials in it
const Store = require('electron-store');
const { encryptString, decryptString } = require('../utils/encryption');
const _ = require('lodash');

class SecretsInstanceStore {
  constructor() {
    this.store = new Store({
      name: 'creds-secrets',
      clearInvalidConfig: true
    });
  }
  isValidValue(val) {
    return typeof val === 'string' && val.length >= 0;
  }
  storeCredsSecrets(collectionPathname, credentials) {
    const collections = this.store.get('collections') || [];
    const collectionIndex = collections.findIndex((c) => c.path === collectionPathname);
    const encryptedCredentials = Object.entries(credentials).reduce((acc, [key, value]) => {
      if (key === 'name') {
        acc[key] = value;
      } else {
        acc[key] = this.isValidValue(value) ? encryptString(value) : '';
      }
      return acc;
    }, {});
    if (collectionIndex === -1) {
      collections.push({
        path: collectionPathname,
        credentials: [encryptedCredentials]
      });
    } else {
      const collection = collections[collectionIndex];
      const credIndex = (collection.credentials || []).findIndex((c) => c.name === credentials.name);
      if (credIndex === -1) {
        collection.credentials = [...(collection.credentials || []), credentials];
      } else {
        collection.credentials = collection.credentials.map((c) => {
          if (c.name === credentials.name) {
            return {
              ...c,
              ...encryptedCredentials
            };
          }
          return c;
        });
      }
    }
    this.store.set('collections', collections);
  }

  getCredsSecrets(collectionPathname, name) {
    const collections = this.store.get('collections') || [];
    const collection = _.find(collections, (c) => c.path === collectionPathname);
    if (!collection) {
      return [];
    }

    const cred = _.find(collection.credentials || [], (e) => e.name === name);
    return cred
      ? Object.entries(cred || {}).reduce((acc, [key, value]) => {
          if (key === 'name') {
            return acc;
          }
          acc[key] = decryptString(value);
          return acc;
        }, {})
      : [];
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

module.exports = SecretsInstanceStore;
