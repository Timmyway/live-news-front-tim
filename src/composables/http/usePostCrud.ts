import { AxiosResponse } from 'axios';
import postApi from 'src/api/postApi';
import { Post } from 'src/interfaces';
import { ref } from 'vue';

export function usePostCrud() {
  const postsFromRemote = ref<Post[]>([]);

  console.log('-- 100 -> Fetch post from the server.');
  const findPost = async (limit = 10) => {
    try {
      const response: AxiosResponse<Post[]> = await postApi.fetchPost(limit);
      if (response.status === 200) {
        postsFromRemote.value = response.data;
      } else {
        throw new Error(
          `Failed to fetch posts. Status code: ${response.status}`
        );
      }
    } catch (err) {
      console.log('-- 101 -> Fetching post from the server has failed.');
      return Promise.reject(err); // Reject the promise with the error
    }
  };

  return { postsFromRemote, findPost };
}
