import { defineStore } from 'pinia';
import { ref } from 'vue';
import PouchDB from 'pouchdb';
import { DatabaseInfos } from 'src/types';
// Pouchdb plugins
import pouchdbFind from 'pouchdb-find';
import pouchdbUpsert from 'pouchdb-upsert';

export const useDatabaseStore = defineStore('database', () => {
  PouchDB.plugin(pouchdbFind);
  PouchDB.plugin(pouchdbUpsert);
  const localDb = ref<PouchDB.Database | null>(null);
  const remoteDb = ref<PouchDB.Database | null>(null);
  const processEnvDatabaseInfos = process.env.databaseInfos;
  const dbInfos = ref<DatabaseInfos>(
    typeof processEnvDatabaseInfos === 'object'
      ? processEnvDatabaseInfos
      : {
          host: '',
          localName: '',
          remoteName: '',
        }
  );

  // function setLocalDb(databaseName: string) {
  //   localDb.value = new PouchDB(databaseName);
  // }

  async function getRemoteDb() {
    const { host, remoteName } = dbInfos.value;
    const remoteUrl = `${host}/${remoteName}`;
    try {
      const dbInstance = new PouchDB(remoteUrl);
      return dbInstance;
    } catch (err) {
      throw err;
    }
  }

  async function getLocalDb() {
    const { localName } = dbInfos.value;
    try {
      const dbInstance = new PouchDB(localName);
      return dbInstance;
    } catch (err) {
      throw err;
    }
  }

  function getLocal() {
    return localDb.value;
  }

  // function setRemoteDb(databaseName: string) {
  //   remoteDb.value = new PouchDB(databaseName);
  // }

  function getRemote() {
    return remoteDb.value;
  }

  return { getLocal, getRemote, getLocalDb, getRemoteDb };
});
