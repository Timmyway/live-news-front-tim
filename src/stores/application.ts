import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAppStore = defineStore('application', () => {
  const $router = useRouter();
  const apiUrl = 'http://localhost:1337/';

  const sync = async () => {
    await $router.push({ name: 'synchronization' });
  };

  const shouldUseCache = ref<boolean>(false);

  return {
    apiUrl,
    shouldUseCache,
    sync,
  };
});
