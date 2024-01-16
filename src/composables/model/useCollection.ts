import { CacheStatus } from 'src/interfaces';
import { useDatabaseStore } from 'src/stores/databases';
import { ref } from 'vue';

export function useCollection(name: string) {
  const collection = ref(null);

  const databaseStore = useDatabaseStore();
  const { getLocalDb } = databaseStore;

  const saveDoc = async (doc: object) => {
    // Save incoming document to local database
    try {
      await getLocalDb().collection(name).add(doc);
    } catch (err) {
      console.log('-- 750 -> Cannot add to locabase database: ', err);
    }
  };

  const setCollection = (docs: object[]) => {
    // Insert incoming doc to local database
    getLocalDb().collection(name).set(docs);
  };

  const getCollection = () => {
    try {
      const results = getLocalDb().collection(name).orderBy('updatedAt').get();
      return results;
    } catch (err) {
      console.log('-- 751 -> Get collection error: ', err);
      return [];
    }
  };

  const hasCachedItems = async (): Promise<CacheStatus> => {
    try {
      const items = await getLocalDb().collection(name).limit(1).get();
      if (items.length > 0) {
        return { status: true, count: items.length };
      }
      return { status: false, count: 0 };
    } catch (err) {
      return { status: false, count: 0 };
    }
  };

  const clearCollection = async () => {
    // Drop entire collection
    try {
      await getLocalDb().collection(name).delete();
    } catch (err) {
      console.log('-- 752 -> Clear collection error: ', err);
    }
  };

  return {
    collection,
    saveDoc,
    getCollection,
    setCollection,
    clearCollection,
    hasCachedItems,
  };
}
