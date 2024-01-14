import { api } from 'src/boot/axios';
import { Post } from 'src/interfaces';

export default {
  async fetchPost(limit = 10) {
    try {
      return await api.get<Post[]>(
        `/posts/find?sort=updatedAt DESC&limit=${limit}`
      );
    } catch (error) {
      throw error;
    }
  },
};
