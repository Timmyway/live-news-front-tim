import { defineStore } from 'pinia';
import { usePaginationConfig } from 'src/composables/config/usePaginationConfig';
import { useRouter } from 'vue-router';

export const useAppStore = defineStore('application', () => {
  const $router = useRouter();
  const apiUrl = 'http://localhost:1337/';

  const sync = async () => {
    await $router.push({ name: 'synchronization' });
  };

  // Display 10
  const { pageItemsCount, allowMoreItems, paginate, resetPageItemsCount } =
    usePaginationConfig({ maxItems: 20 });

  return {
    apiUrl,
    sync,
    pageItemsCount,
    allowMoreItems,
    paginate,
    resetPageItemsCount,
  };
});
