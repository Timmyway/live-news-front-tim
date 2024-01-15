import { PostCollection } from 'src/db/PostModel';
import { CacheStatus } from 'src/interfaces';
import { useDatabaseStore } from 'src/stores/databases';
import { ref } from 'vue';

export function useCollection(name: string) {
  const collection = ref(null);

  const databaseStore = useDatabaseStore();

  const { getLocalDb } = databaseStore;

  const init = async () => {
    console.log('-- 750 -> Init collection: ', name);
    collection.value = await getLocalDb().collection(name).get();
  };

  const saveDoc = async (doc: object) => {
    console.log('-- 750 -> Save doc to local database: ', doc);
    try {
      await getLocalDb().collection(name).add(doc);
    } catch (err) {
      console.log('-- 750.9 -> Cannot add to locabase database: ', err);
    }
  };

  const setCollection = (docs: object[]) => {
    console.log('-- 756 -> Set collection: ', docs.length);
    getLocalDb().collection(name).set(docs);
  };

  const getCollection = async (): Promise<object[] | []> => {
    try {
      const results = await getLocalDb()
        .collection(name)
        .orderBy('updatedAt')
        .get();
      return results;
    } catch (err) {
      console.log('-- 751 -> Get collection error: ', err);
      return [];
    }
  };

  const hasCachedItems = async (): Promise<CacheStatus> => {
    try {
      const items = await getCollection();
      if (items.length > 0) {
        return { status: true, count: items.length };
      }
      return { status: false, count: 0 };
    } catch (err) {
      return { status: false, count: 0 };
    }
  };

  const clearCollection = async () => {
    try {
      // await getLocalDb().collection(name).delete();
      await getLocalDb().collection(name).delete();
      console.log('-- 752 -> Collection cleared successfully');
    } catch (err) {
      console.log('-- 752.1 -> Clear collection error: ', err);
    }
  };

  init();

  return {
    collection,
    saveDoc,
    getCollection,
    setCollection,
    clearCollection,
    hasCachedItems,
  };
}
