// create a safe store with electron-store and store client credentials in it
const Store = require('electron-store');
const { encryptString, decryptString } = require('../utils/encryption');
const _ = require('lodash');

class SecretsInstanceStore {
  constructor() {
    this.store = new Store({
      name: 'secrets-instance',
      clearInvalidConfig: true
    });
  }
  isValidValue(val) {
    return typeof val === 'string' && val.length >= 0;
  }
  storeSecretsInstance(collectionPathname, instance) {
    const collections = this.store.get('collections') || [];
    const collectionIndex = collections.findIndex((c) => c.path === collectionPathname);
    const encryptedCredentials = Object.entries(instance).reduce((acc, [key, value]) => {
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
        secrets: [encryptedCredentials]
      });
    } else {
      const collection = collections[collectionIndex];
      const credIndex = (collection.credentials || []).findIndex((c) => c.name === instance.name);
      if (credIndex === -1) {
        collection.secrets = [...(collection.secrets || []), instance];
      } else {
        collection.secrets = collection.secrets.map((c) => {
          if (c.name === instance.name) {
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

  getSecretsFromInstance(collectionPathname, name) {
    const collections = this.store.get('collections') || [];
    const collection = _.find(collections, (c) => c.path === collectionPathname);
    if (!collection) {
      return [];
    }

    const instance = _.find(collection.secrets || [], (e) => e.name === name);
    return instance
      ? Object.entries(instance || {}).reduce((acc, [key, value]) => {
          if (key === 'name') {
            return acc;
          }
          acc[key] = decryptString(value);
          return acc;
        }, {})
      : [];
  }

  renameSecretsInstance(collectionPathname, oldName, newName) {
    const collections = this.store.get('collections') || [];
    const collection = _.find(collections, (c) => c.path === collectionPathname);
    if (!collection) {
      return;
    }

    const instance = _.find(collection.secrets, (e) => e.name === oldName);
    if (!instance) {
      return;
    }

    instance.name = newName;
    this.store.set('collections', collections);
  }

  deleteSecretsInstance(collectionPathname, name) {
    const collections = this.store.get('collections') || [];
    const collection = _.find(collections, (c) => c.path === collectionPathname);
    if (!collection) {
      return;
    }

    _.remove(collection.secrets, (e) => e.name === name);
    this.store.set('collections', collections);
  }
}

module.exports = SecretsInstanceStore;
