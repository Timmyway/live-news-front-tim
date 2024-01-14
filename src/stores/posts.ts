import { defineStore } from 'pinia';
import { usePostCrud } from 'src/composables/http/usePostCrud';
import { Post } from 'src/interfaces';
import { ref } from 'vue';

export const usePostStore = defineStore('posts', () => {
  const isLoading = ref(false);
  const posts = ref<Post[]>([]);

  console.log('-- 101.0 -> Use post store now...');

  const loadPosts = async (limit = 10) => {
    isLoading.value = true;
    posts.value = [];
    try {
      console.log(
        '-- 101.1 -> Load posts: Limit set for post store fetch: ',
        limit
      );
      const { postsFromRemote, findPost } = usePostCrud();
      await findPost(limit);
      // await findPostFromCacheFirst();
      posts.value = postsFromRemote.value;
      // saveLastPostOffline();
      // console.log('-- 601 -> End of load posts.');
      return posts.value?.length;
    } catch (error) {
      console.error('🚀 ~ file: posts.ts:16 ~ loadPosts ~ error:', error);
      posts.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    posts,
    loadPosts,
  };
});
