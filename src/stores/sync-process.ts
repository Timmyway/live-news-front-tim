import 'pinia';
import { defineStore } from 'pinia';
import { useOnline } from '@vueuse/core';
import { computed, ref } from 'vue';
import { usePostStore } from './posts';
import { usePrefetchAvatars } from 'src/composables/usePrefetchAvatars';
import { useAppStore } from './application';
export const useSyncState = defineStore('sync', () => {
  const isOnline = computed(() => {
    return useOnline();
  });
  const itemsProgression = ref(0);

  const postStore = usePostStore();
  const appStore = useAppStore();

  const getItemsLoadingProgression = computed(() => {
    return itemsProgression.value;
  });
  const getItemsLoadingProgressionValue = computed(() => {
    return itemsProgression.value / 100;
  });

  const setLoadingProgression = (value: number) => {
    itemsProgression.value = value;
  };

  const cancelLoadingProgression = () => {
    // The sync page disappear when below value reach 100.
    itemsProgression.value = 100;
  };

  const process = async () => {
    // Ensure that the progression start from 0.
    itemsProgression.value = 0;
    try {
      // Take advantage of the loading process to request list of posts
      await postStore.loadPosts(appStore.pageItemsCount);
      // After loading more mosts, we have to adjust how they are displayed
      appStore.paginate();
      // Start avatar fetching process
      const { loadAvatarsAsync } = usePrefetchAvatars(
        postStore.posts,
        appStore.apiUrl
      );
      await loadAvatarsAsync();
      // The init page disappear when progression is fully complete.
      itemsProgression.value = 100;
      console.log('-- 001.9 -> Finished loading avatars and posts');
    } catch (err) {
      itemsProgression.value = 100;
    } finally {
      itemsProgression.value = 100;
    }
    // const fakeArray = [10, 25, 50, 75, 100];
    // let index = 0;
    // const intervalId = setInterval(() => {
    //   console.log(
    //     '-- 800 -> Inside clear interval - progression: ',
    //     itemsProgression.value
    //   );
    //   if (index < fakeArray.length) {
    //     itemsProgression.value = fakeArray[index++];
    //   } else {
    //     clearInterval(intervalId);
    //   }
    // }, 1000);
  };

  return {
    isOnline,
    getItemsLoadingProgression,
    getItemsLoadingProgressionValue,
    setLoadingProgression,
    process,
    cancelLoadingProgression,
  };
});
