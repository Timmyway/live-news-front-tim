import { defineStore } from 'pinia';
import { ref } from 'vue';
import Localbase from 'localbase';

export const useDatabaseStore = defineStore('database', () => {
  const localDb = ref();

  const getLocalDb = () => {
    return localDb.value;
  };

  const initDb = () => {
    localDb.value = new Localbase('livenews');
  };

  initDb();

  return { getLocalDb };
});
