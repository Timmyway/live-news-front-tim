import { usePostStore } from 'src/stores/posts';
import { useCollection } from '../model/useCollection';
import { storeToRefs } from 'pinia';
import { toRaw } from 'vue';
import { useCacheStore } from 'src/stores/cache';

export function useOfflineHelper() {
  console.log('-- 001.2 -> Initialize use query.');

  const { getCollection, setCollection, hasCachedItems, clearCollection } =
    useCollection('posts');

  const postStore = usePostStore();
  const { lastPosts } = storeToRefs(postStore);

  const cacheStore = useCacheStore();
  const { cacheValid } = storeToRefs(cacheStore);
  const { activateCache, invalidateCache } = cacheStore;

  const saveLastPostOffline = () => {
    console.log(
      `-- 002 -> Last posts to store offline: ${lastPosts.value.length}`
    );
    // Save last posts offline
    /* I use toRaw because I should pass down an array to the function,
        not the Vue.js proxy.
    */
    setCollection(toRaw(lastPosts.value));
    // Set the cache as valid
    activateCache();
  };

  const loadCacheFirst = async () => {
    const cachedPosts = await hasCachedItems();
    console.log(
      `-- 880 -> Cache state: ${cachedPosts.status} && ${cacheValid.value}`
    );
    // Start using cache where there are more that 10 cached posts.
    if (cachedPosts.status && cachedPosts.count > 10 && cacheValid.value) {
      return true;
    }
    return false;
  };

  const retrieveOfflinePost = async (): Promise<object[]> => {
    // Get posts list from indexed db.
    const cachedPosts = await getCollection();
    console.log(
      `-- 004 -> Retrieved ${cachedPosts.length} docs from local database: `
    );
    return cachedPosts;
  };

  retrieveOfflinePost();

  return {
    saveLastPostOffline,
    retrieveOfflinePost,
    loadCacheFirst,
    invalidateCache,
  };
}
