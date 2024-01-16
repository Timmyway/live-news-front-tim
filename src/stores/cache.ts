import { defineStore } from 'pinia';
import { useCollection } from 'src/composables/model/useCollection';
import { computed, ref, toRaw } from 'vue';

export const useCacheStore = defineStore('caching', () => {
  // Used to determine whether to call new posts from the API or use the cache.
  const cacheValid = ref(
    !!JSON.parse(localStorage.getItem('cacheValid') || 'false')
  );
  const cacheInvalidationJob = ref();
  const cachedPosts = ref<object[]>([]);

  const { clearCollection, getCollection, setCollection } =
    useCollection('posts');

  const activateCache = () => {
    // Activating the caching system by adding this value to local storage.
    localStorage.setItem('cacheValid', JSON.stringify(true));
    cacheValid.value = true;
  };

  const invalidateCache = async () => {
    // Resetting the cache indicates that new posts
    // will be fetched on the next "load posts" call or page refresh.
    localStorage.removeItem('cacheValid');
    cacheValid.value = false;
    await clearCollection();
  };

  const scheduleInvalidation = (intervalInSecond = 10) => {
    // The cache will be invalidated after a specified duration (x time).
    cacheInvalidationJob.value = setInterval(
      invalidateCache,
      1000 * intervalInSecond
    );
  };

  const stopScheduleInvalidation = () => {
    clearInterval(cacheInvalidationJob.value);
  };

  const loadCacheFirst = computed(async () => {
    // Start using cache where there are more that 10 cached posts.
    if (cacheValid.value) {
      return true;
    }
    return false;
  });

  const saveLastPostOffline = async (offlinePosts: object[], init = false) => {
    // Save last posts offline
    /* I use toRaw because I should pass down an array to the function,
        not the Vue.js proxy.
    */
    console.log('Save post offline: -->');
    if (init) {
      // Should run after the loading page appears
      setCollection(toRaw(offlinePosts));
    } else {
      setCollection(toRaw(offlinePosts));
    }

    // Set the cache as valid
    activateCache();
  };

  const getOfflinePost = async () => {
    // Get posts list from indexed db.
    cachedPosts.value = await getCollection();
    return cachedPosts.value;
  };

  return {
    cacheValid,
    cachedPosts,
    loadCacheFirst,
    activateCache,
    invalidateCache,
    scheduleInvalidation,
    stopScheduleInvalidation,
    getOfflinePost,
    saveLastPostOffline,
  };
});
