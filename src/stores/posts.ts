import { defineStore, storeToRefs } from 'pinia';
import { usePostCrud } from 'src/composables/http/usePostCrud';
import { Post } from 'src/interfaces';
import { computed, ref } from 'vue';
import { useOfflineHelper } from 'src/composables/helpers/useOfflineHelper';
import { useAppStore } from './application';

export const usePostStore = defineStore('posts', () => {
  const isLoading = ref(false);
  const posts = ref<Post[] | object[]>([]);
  const apiUnreachable = ref(false);

  console.log('-- 101.0 -> Use post store now...');

  const appStore = useAppStore();
  const { pageItemsCount } = storeToRefs(appStore);

  const loadPosts = async (limit = 10) => {
    isLoading.value = true;
    posts.value = [];

    const { postsFromRemote, findPost } = usePostCrud();

    const { saveLastPostOffline, loadCacheFirst, retrieveOfflinePost } =
      useOfflineHelper();

    try {
      if (!(await loadCacheFirst())) {
        console.log('-- 663 -> Fetch api');

        // Make axios request to get posts from api
        await findPost(limit);
        posts.value = postsFromRemote.value;
        // Keep a copy offline
        saveLastPostOffline();
      } else {
        console.log('-- 664 -> Use cache: ', loadCacheFirst());

        // Retrieve the offline copy
        const offlinePosts = await retrieveOfflinePost();
        posts.value = offlinePosts;
        // Prevent the items per page to be desynchronise with real number of posts
        pageItemsCount.value = posts.value.length;

        console.log(`-- 996 -> ${pageItemsCount.value} fetched posts`);
      }

      return posts.value?.length;
    } catch (error) {
      console.log('--665 -> Probably offline');
      // Handle the case where internet connexion is not available.
      const offlinePosts = await retrieveOfflinePost();
      posts.value = offlinePosts;
      // Display a message that the user is running offline
      // He may not have the most recent posts.
      apiUnreachable.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  const lastPosts = computed((): object[] => {
    // Check if posts.value is an array and has more than 10 items
    if (
      Array.isArray(posts.value) &&
      posts.value.length > pageItemsCount.value
    ) {
      // Return the last ten postsclearCollection
      return posts.value.slice(-10);
    } else {
      // Return all posts if there are 10 or fewer
      return posts.value;
    }
  });
  return {
    isLoading,
    posts,
    lastPosts,
    loadPosts,
    apiUnreachable,
  };
});
