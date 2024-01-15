import { defineStore } from 'pinia';
import { useCollection } from 'src/composables/model/useCollection';
import { ref } from 'vue';

export const useCacheStore = defineStore('caching', () => {
  const cacheValid = ref(
    !!JSON.parse(localStorage.getItem('cacheValid') || 'false')
  );
  const cacheInvalidationJob = ref();

  const { clearCollection } = useCollection('posts');

  const activateCache = () => {
    localStorage.setItem('cacheValid', JSON.stringify(true));
    cacheValid.value = true;
    console.log('-- 900 -> Cache has been activated');
  };

  const invalidateCache = () => {
    // Reset all needed settings for offline mode.
    localStorage.removeItem('cacheValid');
    cacheValid.value = false;
    clearCollection();
    console.log('-- 909 -> Cache has been invalidated');
  };

  const scheduleInvalidation = (intervalInSecond = 10) => {
    console.log(
      `-- 901 -> Start job: cache will be invalidated in ${intervalInSecond} seconds`
    );
    // Set up the interval job
    cacheInvalidationJob.value = setInterval(
      invalidateCache,
      1000 * intervalInSecond
    );
  };

  const stopScheduleInvalidation = () => {
    console.log('-- 908 -> Cancel cache interval');
    clearInterval(cacheInvalidationJob.value);
  };

  return {
    cacheValid,
    activateCache,
    invalidateCache,
    scheduleInvalidation,
    stopScheduleInvalidation,
  };
});
