import { defineStore } from 'pinia';
import { usePaginationConfig } from 'src/composables/config/usePaginationConfig';
import { useCollection } from 'src/composables/model/useCollection';
import { CacheStatus } from 'src/interfaces';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAppStore = defineStore('application', () => {
  const $router = useRouter();
  const apiUrl = 'http://localhost:1337/';

  const sync = async () => {
    await $router.push({ name: 'synchronization' });
  };

  const { hasCachedItems } = useCollection('posts');
  const getCachedPosts = async (): Promise<CacheStatus> => {
    return hasCachedItems();
  };

  // Display 10
  const {
    pageItemsCount,
    allowMoreItems,
    maxItemCount,
    paginate,
    resetPageItemsCount,
  } = usePaginationConfig({ maxItems: 50 });

  return {
    apiUrl,
    sync,
    pageItemsCount,
    allowMoreItems,
    maxItemCount,
    getCachedPosts,
    paginate,
    resetPageItemsCount,
  };
});
