import { defineStore, storeToRefs } from 'pinia';
import { usePostCrud } from 'src/composables/http/usePostCrud';
import { Post } from 'src/interfaces';
import { computed, ref } from 'vue';
import { useCacheStore } from './cache';

export const usePostStore = defineStore('posts', () => {
  const isLoading = ref(false);
  const apiUnreachable = ref(false);

  const posts = ref<Post[] | object[]>([]);
  const postOffset = ref(0);
  const newPosts = ref<object[]>([]);

  // Useful to make api call to get list of posts
  const { postsFromRemote, findPost } = usePostCrud();
  // Dedicated store to manage cached posts
  const cacheStore = useCacheStore();
  const { cacheValid } = storeToRefs(cacheStore);
  const { getOfflinePost, saveLastPostOffline } = cacheStore;

  const outOfRange = computed(() => {
    // There are no more posts to load.
    if (postOffset.value > newPosts.value.length) {
      return true;
    }
    return false;
  });

  const slicedPosts = computed(() => {
    if (outOfRange.value) {
      return [];
    }
    // Validate postOffset.value to prevent negative indices
    const startIndex = Math.max(0, newPosts.value.length - postOffset.value);
    // Ensure endIndex is at least 0
    const endIndex = Math.max(0, newPosts.value.length);
    // Use slice with adjusted start index and endIndex
    return newPosts.value.slice(startIndex, endIndex);
  });

  const pushUniqueItems = (target: object[], source: object[]): void => {
    const targetSet = new Set(target.map((item) => JSON.stringify(item)));
    const newItems = source.filter(
      (item) => !targetSet.has(JSON.stringify(item))
    );

    target.push(...newItems);
  };

  const loadPosts = async () => {
    if (outOfRange.value) {
      console.log('-- 999 -> Out of range');
      return;
    }
    console.log('777 --------------------------->', posts.value);
    isLoading.value = true;
    try {
      console.log('-- 662.0 -> Cache valid value: ', cacheValid.value);
      if (!cacheValid.value) {
        console.log('-- 662.1 -> Fetch api');
        // Make axios request to get posts from api
        await handleApiCall({ limit: 0 });
      } else {
        console.log('-- 664 -> Use cache: ');
        // Retrieve the offline copy
        await handleCache();
        console.log('778 After cache handled -->');
        // Prevent the items per page to be desynchronise with real number of posts
        // addDummyPost();
      }
    } catch (error) {
      console.log('--665 -> Probably offline', error);
      // Handle the case where internet connexion is not available.
      // await getOfflinePost();
      // Display a message that the user is running offline
      // He may not have the most recent posts.
      apiUnreachable.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  const handleApiCall = async ({ limit = 10 }) => {
    try {
      // Call api that store posts inside "postFromRemote" state variable.
      await findPost(limit);
    } catch (err) {
      console.log('-- 760 -> Error find post: ', err);
    }

    if (postsFromRemote.value.length > 0) {
      // Save a copy of posts in the local database
      await saveLastPostOffline(postsFromRemote.value);
      // This offset trigger the value of computed property "slicedPosts".
      postOffset.value += 10;
      // Update posts's list value.
      newPosts.value = [...postsFromRemote.value];
      pushUniqueItems(posts.value, slicedPosts.value);
    }
  };

  const offlinePosts = computed(() => {
    // NB: Fixed the bug that make infinite scroll goes up after each iteration
    /*
      When we try to retrieve posts from indexedDB, its causes a bug
      with quasar infinite scroll, so i have to put it inside a computed property.
      It's an a
    */
    return getOfflinePost();
  });

  const handleCache = async () => {
    // cf "handleApiCall" method
    postOffset.value += 10;
    // NB: Fixed the bug that make infinite scroll goes up after each iteration
    const offlinePostsRef = await offlinePosts.value;
    newPosts.value = [...offlinePostsRef];
    pushUniqueItems(posts.value, slicedPosts.value);
  };

  const resetPosts = () => {
    // Posts setting reset
    postOffset.value = 0;
    newPosts.value = [];
  };

  return {
    isLoading,
    posts,
    loadPosts,
    resetPosts,
    apiUnreachable,
    handleCache,
    handleApiCall,
    postOffset,
    outOfRange,
  };
});
