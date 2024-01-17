import { api } from 'src/boot/axios';
import { Post } from 'src/interfaces';

export default {
  async fetchPost(limit = 10) {
    try {
      const apiUrl = limit
        ? `/posts?sort=updatedAt DESC&limit=${limit}`
        : '/posts?sort=updatedAt DESC';

      // If limit is set, use limit else find all posts
      return await api.get<Post[]>(apiUrl);
    } catch (error) {
      throw error;
    }
  },
};
